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

function gui_values(){
  parameterize("num_cols", 10, 1, 100, 1, false);
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
  const num_rows = floor(canvas_y/tile_size);

  let shape_1 = [{col:1, row:1}, {col:2, row:1}, {col:1, row:2}];
  let shape_1_pts = [];
  find_upper_left_tile(shape_1, num_cols, num_rows);
  const start_tile = shape_1[0];

  let direction = "right";
  while(true){
    const current_tile = shape_1[0];
    //generate points
    shape_1_pts.push(...generate_points(current_tile, tile_size, 2, direction));

    if(direction == "up")
      if(current_tile.col==start_tile.col && current_tile.row ==start_tile.row){
      //TODO generate last corner
      break;
    }

    //get new direction
    direction = find_adjacent_tile_in_dir(shape_1, direction);
  }

  noFill();
  console.log(shape_1_pts);
  draw_shape(shape_1_pts);

  // show_grid(num_cols, num_rows, tile_size);
  // show_shape_tiles(shape_1, tile_size, "blue");

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
    square(tile.col * tile_size, tile.row * tile_size, tile_size);
  }
  pop();  
}

function find_upper_left_tile(shape, columns, rows){
  //returns the input shape with the upper-left tile in the 0 index
  let smallest_col = columns + 1;
  let smallest_row = rows + 1;
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

  if(starting_index != next_index){
    direction = turn_counterclockwise(direction);
    console.log("turn counterclockwise");
  }

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
  push();
  const starting_x = tile.col*tile_size;
  const starting_y = tile.row*tile_size;
  const pts = [];
  translate(starting_x, starting_y);
  for(let i=0; i<num_pts; i++){
    push();
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
    pop();
  }
  pop();
  return pts;
}

function draw_shape(pts){
  beginShape();
  for(let i=0; i<pts.length+3; i++){
    const pt = pts[i%pts.length];
    curveVertex(pt[0], pt[1]);
  }
  endShape();
}