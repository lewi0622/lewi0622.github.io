'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 30;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];
const clockwise_directions = ["right", "down", "left", "up"];
const counterclockwise_directions = ["right", "up", "left", "down"];
let convex_corner;
let num_rows;

function gui_values(){
  parameterize("num_cols", 10, 1, 100, 1, false);
  parameterize("num_shapes", 5, 1, 100, 1, false);
}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();

  push();

  const tile_size = canvas_x/num_cols;
  num_rows = floor(canvas_y/tile_size);
  convex_corner = false;
  // show_grid(num_cols, num_rows, tile_size);
  const shapes = [];
  //generate shapes
  for(let i=0 ; i<num_shapes; i++){
    generate_shapes(shapes);
  }

  //TODO
  //consider removing redundant tiles or tiles with other tiles on all four sides
  //convert pt creation to use noise instead of rand
  //switch from random walker to use a noise map system
  //concentric fill won't work well with large/complex/odd shapes, but would work well with blobs

  //concentric fill for a given weight
    //convert col/row to x/y to polar coords
    //find center of shape
    //either
      //lerp all radii to 0 over a certain number of steps
    //or
      //while loop stepping each radii down by weight until it's <weight
  //verify shapes are closed and occult properly.

  // demo shape
  // shapes.push([{col:1, row:1}, {col:2, row:1}, {col:1, row:2}]);

  for(let i=0; i<shapes.length; i++){
    const current_shape = shapes[i];
    let shape_pts = [];
    find_upper_left_tile(current_shape);
    const start_tile = current_shape[0];
  
    let direction = "right";
    while(true){
      const current_tile = current_shape[0];
      //generate points
      shape_pts.push(...generate_points(current_tile, tile_size, 2, direction));
  
      if(direction == "up")
        if(current_tile.col==start_tile.col && current_tile.row ==start_tile.row){
        //TODO generate last corner
        break;
      }
  
      //get new direction
      direction = find_adjacent_tile_in_dir(current_shape, direction);
    }
  
    noFill();
    draw_shape(shape_pts);
  

    // show_shape_tiles(current_shape, tile_size, "blue");
  }



  pop();
  
  global_draw_end();
}
//***************************************************
//custom funcs

function show_grid(num_cols, num_rows, tile_size){
  //grid
  for(let i=0; i<num_cols; i++){
    for(let j=0; j<num_rows; j++){
      push();
      translate(i*tile_size, j*tile_size);
      square(0,0,tile_size);
      pop();
    }
  }
}

function show_shape_tiles(shape, tile_size, tile_fill="red"){
  //shape
  push();
  fill(tile_fill);
  for(let i=0; i<shape.length; i++){
    const tile = shape[i];
    console.log(tile.col * tile_size, tile.row * tile_size, tile_size)
    square(tile.col * tile_size, tile.row * tile_size, tile_size);
  }
  pop();  
}

function find_upper_left_tile(shape){
  //returns the input shape with the upper-left tile in the 0 index
  let smallest_col = num_cols + 1;
  let smallest_row = num_rows + 1;
  let smallest_index = -1;
  for(let i=0; i<shape.length; i++){
    const tile = shape[i];
    if(tile.row<smallest_row) smallest_row = tile.row;
  }
  for(let i=0; i<shape.length; i++){
    const tile = shape[i];
    if(tile.row==smallest_row && tile.col<smallest_col){
      smallest_col = tile.col;
      smallest_index = i;
    }
  }
  shape.unshift(shape.splice(smallest_index, 1)[0]); //puts the upper left corner tile first in the array
  return shape;
}

function find_adjacent_tile_in_dir(shape, direction){
  const starting_row = shape[0].row;
  const starting_col = shape[0].col;
  let next_tile = shape[0];
  let next_index = -1;
  for(let i=1; i<shape.length; i++){
    const current_tile = shape[i];
    if(direction == "right"){
      if(starting_row == current_tile.row && starting_col+1 == current_tile.col){
        next_tile = current_tile;
        next_index = i;
        console.log("found right");
        break;
      }
    }
    else if(direction == "down"){
      if(starting_row+1 == current_tile.row && starting_col == current_tile.col){
        next_tile = current_tile;
        next_index = i;
        console.log("found down");
        break;
      }
    }
    else if(direction == "left"){
      if(starting_row == current_tile.row && starting_col-1 == current_tile.col){
        next_tile = current_tile;
        next_index = i;
        console.log("found left");
        break;
      }
    }
    else if(direction == "up"){
      if(starting_row-1 == current_tile.row && starting_col == current_tile.col){
        next_tile = current_tile;
        next_index = i;
        console.log("found up");
        break;
      }
    }
  }

  //check for convex corner
  [next_index, direction] = find_convex_corner(shape, next_tile, next_index, direction);

  //if no next tile, turn corner
  if(next_index == -1){
    console.log("turn clockwise");
    direction = turn_clockwise(direction);
  }
  else{
    shape.unshift(shape.splice(next_index, 1)[0]);
  }

  return direction;
}

function find_convex_corner(shape, tile, next_index, direction){
  const starting_index = next_index;
  for(let i=0; i<shape.length; i++){
    const current_tile = shape[i];
    if(direction == "right"){
      if(tile.row-1 == current_tile.row && tile.col == current_tile.col){
        next_index = i;
      }
    }
    if(direction == "down"){
      if(tile.row == current_tile.row && tile.col+1 == current_tile.col){
        next_index = i;
      }
    }
    if(direction == "left"){
      if(tile.row+1 == current_tile.row && tile.col == current_tile.col){
        next_index = i;
      }
    }
    if(direction == "up"){
      if(tile.row == current_tile.row && tile.col-1 == current_tile.col){
        next_index = i;
      }
    }
  }

  if(starting_index != next_index){ //convex corner found
    convex_corner = true;
    direction = turn_counterclockwise(direction);
    // console.log("turn counterclockwise");
  }
  else convex_corner = false;

  return [next_index, direction];
}

function turn_clockwise(direction){
  const idx = clockwise_directions.indexOf(direction);
  return clockwise_directions[(idx+1)%clockwise_directions.length];
}

function turn_counterclockwise(direction){
  const idx = counterclockwise_directions.indexOf(direction);
  return counterclockwise_directions[(idx+1)%counterclockwise_directions.length];
}

function generate_points(tile, tile_size, num_pts, direction){
  //generates num_pts amount of points -90 degrees from the given direciton
  const starting_x = tile.col*tile_size;
  const starting_y = tile.row*tile_size;
  const pts = [];
  for(let i=0; i<num_pts; i++){
    if(convex_corner && i==0) continue;
    let magnitude;
    if(i%2==0) magnitude = random(tile_size/4, tile_size/2);
    else magnitude = random(0, tile_size/4);

    if(direction == "right"){
      pts.push([
        starting_x + i * tile_size/num_pts, 
        starting_y - magnitude]);
    }
    else if(direction == "down"){
      pts.push([
        starting_x + magnitude + tile_size, 
        starting_y + i * tile_size/num_pts]);
    }
    else if(direction == "left"){
      pts.push([
        starting_x + tile_size - i * tile_size/num_pts, 
        starting_y + magnitude + tile_size])
    }
    else if(direction == "up"){
      pts.push([
        starting_x - magnitude, 
        starting_y + tile_size - i * tile_size/num_pts])
    }
  }
  return pts;
}

function draw_shape(pts, shape_color = random(working_palette)){
  push();
  stroke(shape_color);
  fill(shape_color);

  beginShape();
  for(let i=0; i<pts.length+3; i++){
    const pt = pts[i%pts.length];
    curveVertex(pt[0], pt[1]);
  }
  endShape();
  pop();
}

function generate_shapes(shapes){
  //random walker algo
  const current_shape = [];
  const num_steps = num_cols;
  const starting_col = floor(random(num_cols));
  const starting_row = floor(random(num_rows));
  for(let i=0; i<num_steps; i++){
    if(i==0){ 
      current_shape.push({col: starting_col, row: starting_row});
      continue;
    }
    let current_tile = current_shape[i-1];
    let next_col, next_row;
    let legal_move = false;
    while(!legal_move){
      let direction = random(clockwise_directions);
      if(direction == "right"){
        next_col = current_tile.col + 1;
        next_row = current_tile.row;
      }
      else if(direction == "down"){
        next_col = current_tile.col;
        next_row = current_tile.row + 1;
      }
      else if(direction == "left"){
        next_col = current_tile.col - 1;
        next_row = current_tile.row;
      }
      else if(direction == "up"){
        next_col = current_tile.col;
        next_row = current_tile.row - 1;
      }
      legal_move = next_col<num_cols && next_row<num_rows && next_col>=0 && next_row>=0;
    }
    current_shape.push({col: next_col, row:next_row});
  }
  shapes.push(current_shape);
}