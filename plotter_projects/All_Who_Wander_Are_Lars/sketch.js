'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 5;
const capture = false;
const capture_time = 50/fr;

const suggested_palettes = [];
const clockwise_directions = ["right", "down", "left", "up"];
const counterclockwise_directions = ["right", "up", "left", "down"];
let concave_corner, num_rows, tile_size, weight, c_idx;
// let map_iterations;

function gui_values(){
  parameterize("num_cols", floor(random(20, 70)), 1, 1000, 1, false);
  parameterize("map_iterations", floor(random(5,20)), 1, 200, 1, false);
  parameterize("iteration_jump", 1, 1, 100, 1, false);
  parameterize("min_shape_pts", 3, 1, 100, 1, false);
  parameterize('flow_step_size', random(20,50), 0, 100, 1, true);
}

function setup() {
  common_setup();
  gui_values();
  // map_iterations = 0;
  png_bg(false);
}
//***************************************************
function draw() {
  global_draw_start(false);

  push();
  c_idx = 0;

  weight = POSCA*global_scale;
  strokeWeight(weight);
  tile_size = canvas_x/num_cols;
  num_rows = floor(canvas_y/tile_size);
  concave_corner = false;
  // show_grid(num_cols, num_rows, tile_size);

  //generate shapes
  for(let i=0 ; i<map_iterations; i++){
    const shapes = [];
    generate_shape(shapes, i, map_iterations);

    if(i%iteration_jump==0) c_idx++; //map iterations per color
    const shape_color = working_palette[c_idx%working_palette.length];
    for(let j=0; j<shapes.length; j++){
      const current_shape = shapes[j];
      let shape_pts = trace_shape(current_shape, i);
      curveTightness(random(-0.5,0));
      if(shape_pts.length>min_shape_pts) draw_shape(shape_pts, shape_color);
    
      // show_shape_tiles(current_shape, "blue");
    }
  }

  //TODO
  //concentric fill won't work well with large/complex/odd shapes, but would work well with blobs

  //concentric fill for a given weight
    //convert col/row to x/y to polar coords
    //find center of shape
    //either
      //lerp all radii to 0 over a certain number of steps
    //or
      //while loop stepping each radii down by weight until it's <weight
  //verify shapes are closed and occult properly.
  pop();
  // map_iterations++;
  // if(map_iterations > 100) map_iterations = 100;
  global_draw_end();
}
//***************************************************
//custom funcs

function trace_shape(shape, iterator){
  //finds outline of shape and returns generated points
  const pts = [];
  find_upper_left_tile(shape);
  const start_tile = shape[0];

  let direction = "right";
  while(true){
    const current_tile = shape[0];
    //generate points
    pts.push(...generate_points(current_tile, tile_size, 1, direction, iterator));

    if(direction == "up" &&
      current_tile.col==start_tile.col  &&
      current_tile.row ==start_tile.row) break;//end of shape

    //get new direction
    direction = find_adjacent_tile_in_dir(shape, direction);
  }
  //simplify shape
  let simplified_pts = [];
  for(let i=0; i<pts.length; i++){
    if(i%2==1) continue;
    else simplified_pts.push(pts[i]);
  }
  return simplified_pts;
}

function show_grid(num_cols, num_rows, tile_size){
  //debug function for showing the underlying grid
  for(let i=0; i<num_cols; i++){
    for(let j=0; j<num_rows; j++){
      push();
      translate(i*tile_size, j*tile_size);
      square(0,0,tile_size);
      pop();
    }
  }
}

function show_shape_tiles(shape, tile_fill="red"){
  //debug function for showing the shape tiles
  push();
  fill(tile_fill);
  for(let i=0; i<shape.length; i++){
    const tile = shape[i];
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
    if(direction == "right" &&
      starting_row == current_tile.row && 
      starting_col+1 == current_tile.col){
        next_tile = current_tile;
        next_index = i;
        break;
    }
    else if(direction == "down" &&
      starting_row+1 == current_tile.row && 
      starting_col == current_tile.col){
        next_tile = current_tile;
        next_index = i;
        break;
    }
    else if(direction == "left" && 
      starting_row == current_tile.row && 
      starting_col-1 == current_tile.col){
        next_tile = current_tile;
        next_index = i;
        break;
    }
    else if(direction == "up" &&
      starting_row-1 == current_tile.row && 
      starting_col == current_tile.col){
        next_tile = current_tile;
        next_index = i;
        break;
    }
  }

  //check for concave corner
  [next_index, direction] = find_concave_corner(shape, next_tile, next_index, direction);

  //if no next tile, turn corner
  if(next_index == -1) direction = turn_clockwise(direction);
  else shape.unshift(shape.splice(next_index, 1)[0]);

  return direction;
}

function find_concave_corner(shape, tile, next_index, direction){
  const starting_index = next_index;
  for(let i=0; i<shape.length; i++){
    const current_tile = shape[i];
    if(direction == "right" && 
      tile.row-1 == current_tile.row && 
      tile.col == current_tile.col){
        next_index = i;
        break;
    }
    if(direction == "down" &&
      tile.row == current_tile.row && 
      tile.col+1 == current_tile.col){
        next_index = i;
        break;
    }
    if(direction == "left" && 
      tile.row+1 == current_tile.row && 
      tile.col == current_tile.col){
        next_index = i;
        break;
    }
    if(direction == "up" && 
      tile.row == current_tile.row && 
      tile.col-1 == current_tile.col){
        next_index = i;
        break;
    }
  }

  concave_corner = starting_index != next_index;
  if(concave_corner) direction = turn_counterclockwise(direction);

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

function generate_points(tile, tile_size, num_pts, direction, iterator){
  //generates num_pts amount of points -90 degrees from the given direciton
  const starting_x = tile.col*tile_size;
  const starting_y = tile.row*tile_size;
  const pts = [];
  for(let i=0; i<num_pts; i++){
    if(concave_corner && i==0) continue;
    // let magnitude = random(0, tile_size/4);
    // if(i%2==0) magnitude = random(tile_size/4, tile_size/2);
    let magnitude = tile_size;

    let x,y;
    if(direction == "right"){
      x = starting_x + i * tile_size/num_pts; 
      y = starting_y - magnitude;
    }
    else if(direction == "down"){
      x = starting_x + magnitude + tile_size; 
      y = starting_y + i * tile_size/num_pts;
    }
    else if(direction == "left"){
      x = starting_x + tile_size - i * tile_size/num_pts;
      y = starting_y + magnitude + tile_size;
    }
    else if(direction == "up"){
      x = starting_x - magnitude;
      y = starting_y + tile_size - i * tile_size/num_pts;
    }
    // const flow_step_size = smaller_base/50 * global_scale;
    const iterations = floor(map(noise(iterator), 0,1, 20,60));
    [x,y] = flow_pts(x, y, iterator, iterations, 0, flow_step_size);
    
    pts.push([x,y]);
  }
  return pts;
}

function flow_pts(starting_x, starting_y, z, iterations, x_amp, y_amp, x_damp=1000*global_scale, y_damp=1000*global_scale, z_damp=200){
  let x = starting_x;
  let y = starting_y;
  for(let i=0; i<iterations; i++){
    const x_diff = map(noise(x/x_damp, y/y_damp, z/z_damp), 0,1, -x_amp, x_amp);
    const y_diff = map(noise(x/x_damp, y/y_damp, z/z_damp), 0,1, -y_amp, y_amp);
    x += x_diff;
    y += y_diff;
  }

  return [x,y];
}

function draw_shape(pts, shape_color = random(working_palette)){
  push();
  if(type == 'png'){
    noStroke();
    fill(shape_color);
    if(random()>0.8) blendMode(MULTIPLY);
  }
  else{
    stroke(shape_color);
  }

  // stroke("BLACK")
  // noFill();

  beginShape();
  for(let i=0; i<pts.length+3; i++){
    // if(i%2==0) continue;
    const pt = pts[i%pts.length];
    curveVertex(pt[0], pt[1]);
  }
  endShape();
  pop();
}

function generate_shape(shapes, iterator, total_iterations){
  //random walker algo
  // const current_shape = [];
  // const num_steps = num_cols;
  // const starting_col = floor(random(num_cols));
  // const starting_row = floor(random(num_rows));
  // for(let i=0; i<num_steps; i++){
  //   if(i==0){ 
  //     current_shape.push({col: starting_col, row: starting_row});
  //     continue;
  //   }
  //   let current_tile = current_shape[i-1];
  //   let next_col, next_row;
  //   let legal_move = false;
  //   while(!legal_move){
  //     let direction = random(clockwise_directions);
  //     if(direction == "right"){
  //       next_col = current_tile.col + 1;
  //       next_row = current_tile.row;
  //     }
  //     else if(direction == "down"){
  //       next_col = current_tile.col;
  //       next_row = current_tile.row + 1;
  //     }
  //     else if(direction == "left"){
  //       next_col = current_tile.col - 1;
  //       next_row = current_tile.row;
  //     }
  //     else if(direction == "up"){
  //       next_col = current_tile.col;
  //       next_row = current_tile.row - 1;
  //     }
  //     legal_move = next_col<num_cols && next_row<num_rows && next_col>=0 && next_row>=0;
  //   }
  //   current_shape.push({col: next_col, row:next_row});
  // }
  // shapes.push(current_shape);
  const tiles = create_noise_tiles(
    iterator, 
    lerp(0.5,0, iterator/total_iterations), 
    lerp(0.5,1, iterator/total_iterations)
  );
  const parsed = parse_tiles(tiles);
  shapes.push(...parsed);
}

function create_noise_tiles(iterator, lower_noise_max=.35, upper_noise_min=0.65, col_damp=500*global_scale, row_damp=500*global_scale, z_damp=1){
    //noise map based
  //need col/row damp values, start with 100
  //for each shape generated 
  //general idea is to take certain chunk of the noise spectrum 0.3-0.6?
  //it turns out that a huge amount of the noise values are between 0.3 and 0.6, but it tapers off towards the tails.
  //if you take values from the middle, you need to use a smaller min/max gap.
  //and use that as every shape gen, but step the z for each 
  const shape_tiles = [];

  for(let i=0; i<num_cols; i++){
    for(let j=0; j<num_rows; j++){
      const x = i * tile_size;
      const y = j * tile_size;
      let z = iterator + iterator%iteration_jump/z_damp;
      if(iterator%iteration_jump != 0) z -= iterator%iteration_jump; 
      const noise_val = noise(x/col_damp, y/row_damp, iterator/z_damp);
      if(noise_val<lower_noise_max || noise_val>upper_noise_min) shape_tiles.push({col:i, row:j});
    }
  }
  return shape_tiles;
}

function parse_tiles(tiles){
  //takes a noise map of tiles, some contiguous, some not, and returns an array of arrays of contiguous tiles
  const shapes = [];
  while(tiles.length>0){
    const shape = [];
    const first_tile = tiles.splice(0,1)[0];
    shape.push(first_tile);
    shape.push(...find_adjacent(first_tile, tiles));
    shapes.push(shape);
  }
  return shapes;
}

function find_adjacent(tile, tiles){
  //recursive func that returns all adjacent tiles, adjusting the tiles arr as it goes
  const adjacent_tiles = [];
  for(let i=0; i<tiles.length; i++){
    const current_tile = tiles[i];
    if(
      current_tile.col == tile.col + 1 && current_tile.row == tile.row ||
      current_tile.col == tile.col - 1 && current_tile.row == tile.row ||
      current_tile.row == tile.row + 1 && current_tile.col == tile.col ||
      current_tile.row == tile.row - 1 && current_tile.col == tile.col 
    ) adjacent_tiles.push(tiles.splice(i,1)[0]);
  }

  const returned_tiles = [...adjacent_tiles];
  for(let i=0; i<adjacent_tiles.length; i++){
    returned_tiles.push(...find_adjacent(adjacent_tiles[i], tiles));
  }
  return returned_tiles;
}