'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 30;

const suggested_palettes = [BIRDSOFPARADISE, SOUTHWEST, SIXTIES, SUPPERWARE];
const clockwise_directions = ["right", "down", "left", "up"];
const counterclockwise_directions = ["right", "up", "left", "down"];
let concave_corner, num_rows, tile_size, weight, c_idx, bg_c, num_cols;

let time_offset=100*30/fr; 
const time_inc = 0.04;
let time_direction;

function gui_values(){
  // parameterize("num_cols", floor(base_x/8), 1, base_x, 1, false);
  parameterize("map_iterations", floor(random(1,6)), 1, 10, 1, false);
  parameterize("iteration_jump", 1, 1, 100, 1, false);
  parameterize("min_shape_pts", 1, 1, 100, 1, false);
  parameterize('flow_step_size', random(30,40), 15, 60, 1, true);
  parameterize("perlin_simplex", 0, 0, 1, 1, false);
}

function setup() {
  common_setup();
  gui_values();
  num_cols = floor(base_x/8);
  working_palette = controlled_shuffle(working_palette, true)
  bg_c = png_bg(true);
  time_direction = random([-1,1]);
}
//***************************************************
function draw() { 
  global_draw_start();
  background(bg_c);
  push();
  c_idx = 0;
  translate(-canvas_x/4, -canvas_y/4);
  tile_size = canvas_x*1.5/num_cols;
  num_rows = floor(canvas_y*1.5/tile_size);
  concave_corner = false;
  // show_grid(num_cols, num_rows, tile_size);

  //generate shapes
  for(let i=0 ; i<map_iterations; i++){
    const shapes = [];
    generate_shape(shapes, i, map_iterations);

    c_idx++; //map iterations per color
    const shape_color = working_palette[c_idx%working_palette.length];
    for(let j=0; j<shapes.length; j++){
      const current_shape = shapes[j];
      let shape_pts = trace_shape(current_shape, i);
      line_blur("BLACK", 0, lerp(10,30,j/shapes.length)*global_scale * time_direction, 0);
      if(shape_pts.length>min_shape_pts) draw_shape(shape_pts, shape_color);
    }
  }
  if(perlin_simplex) time_offset += (map(pnoise.simplex2(frameCount/100,0), -1,1, 0.5,0.75) * time_inc * frameRate()/fr) * time_direction;
  else  time_offset += (map(noise(frameCount/100), 0,1, 0.75,1.15) * time_inc * frameRate()/fr) * time_direction;
  pop();
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
    let iterations;
    if(perlin_simplex) iterations = floor(map(pnoise.simplex2(iterator,0), -1,1, 20,60));
    else iterations = floor(map(noise(iterator), 0,1, 20,60));
    [x,y] = flow_pts(x, y, iterator, iterations, flow_step_size/2, flow_step_size);
    
    pts.push([x,y]);
  }
  return pts;
}

function flow_pts(starting_x, starting_y, z, iterations, x_amp, y_amp, x_damp=1000*global_scale, y_damp=1000*global_scale, z_damp=200){
  let x = starting_x;
  let y = starting_y;
  for(let i=0; i<iterations; i++){
    let x_diff, y_diff;
    if(perlin_simplex){
      x_diff = map(pnoise.simplex3(x/x_damp, y/y_damp, time_offset/10 + z/z_damp), -1,1, -x_amp, x_amp);
      y_diff = map(pnoise.simplex3(x/x_damp, y/y_damp, time_offset/1000 + z/z_damp), -1,1, -y_amp, y_amp);
    }
    else{
      x_diff = map(noise(x/x_damp, y/y_damp, time_offset/10 + z/z_damp), 0,1, -x_amp, x_amp);
      y_diff = map(noise(x/x_damp, y/y_damp, time_offset/1000 + z/z_damp), 0,1, -y_amp, y_amp);
    } 
    x += x_diff;
    y += y_diff;
  }

  return [x,y];
}

function draw_shape(pts, shape_color = random(working_palette)){
  push();

  noStroke();
  fill(shape_color);

  //find center of object
  let x_min = canvas_x*10;
  let x_max = -canvas_x*10;
  let y_min = canvas_y*10;
  let y_max = -canvas_y*10;
  let sum_x = 0;
  let sum_y = 0;
  for(let i=0; i<pts.length; i++){
    const pt = pts[i];
    sum_x += pt[0];
    sum_y += pt[1];
    if(pt[0]<x_min) x_min = pt[0];
    if(pt[0]>x_max) x_max = pt[0];
    if(pt[1]<y_min) y_min = pt[1];
    if(pt[1]>y_max) y_max = pt[1];
  }
  const x_center = sum_x/pts.length;
  const y_center = sum_y/pts.length;

  //convert shape pts from cartesian to polar
  const polar_shape = [];
  for(let i=0; i<pts.length; i++){
    const x = pts[i][0] - x_center;
    const y = pts[i][1] - y_center;
    const radius = sqrt(x*x + y*y);
    const theta = atan2(y,x);
    polar_shape.push({radius:radius, theta:theta});
  }

  translate(x_center, y_center);

  push();
  beginShape();
  for(let i=0; i<polar_shape.length+3; i++){
    const pt = polar_shape[i%polar_shape.length];
    const x = pt.radius * cos(pt.theta);
    const y = pt.radius * sin(pt.theta);
    curveVertex(x,y);
  }
  endShape();
  pop();

  pop();
}

function generate_shape(shapes, iterator, total_iterations){
  let tiles;
  if(perlin_simplex) tiles = create_noise_tiles(
    iterator, 
    -0.65,
    0.7);
  else tiles = create_noise_tiles(
    iterator, 
    0.35,
    0.7);
  const parsed = parse_tiles(tiles);
  shapes.push(...parsed);
}

function create_noise_tiles(iterator, lower_noise_max=.35, upper_noise_min=0.65, col_damp=500*global_scale, row_damp=250*global_scale, z_damp=1){
  //noise map based
  const shape_tiles = [];
  
  for(let i=0; i<num_cols; i++){
    for(let j=0; j<num_rows; j++){
      const x = i * tile_size;
      const y = j * tile_size;
      let z = iterator //+ iterator%iteration_jump/z_damp;
      //if(iterator%iteration_jump != 0) z -= iterator%iteration_jump; 
      let noise_val;
      if(perlin_simplex) noise_val = pnoise.simplex3(
        time_offset + x/col_damp, 
        y/row_damp,  
        time_offset/500 + z/z_damp);
      else  noise_val = noise(
        time_offset + x/col_damp, 
        y/row_damp,  
        time_offset/500 + z/z_damp);

      noise_val = round(noise_val*1000)/1000;
      
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