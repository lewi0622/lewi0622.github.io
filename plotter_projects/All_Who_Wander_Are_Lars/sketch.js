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
let concave_corner, num_rows, tile_size, weight, c_idx, bg_c;

function gui_values(){
  parameterize("num_cols", floor(random(20, 70)), 1, 1000, 1, false);
  parameterize("map_iterations", floor(random(5,20)), 1, 200, 1, false);
  parameterize("iteration_jump", 1, 1, 100, 1, false);
  parameterize("min_shape_pts", 3, 1, 100, 1, false);
  parameterize('flow_step_size', random(20,50), 0, 100, 1, true);
  parameterize("alpha", 20, 0, 255, 1, false);
}

function setup() {
  common_setup();
  gui_values();

}
//***************************************************
function draw() {
  //for concentric fill, consider creating the curve in svg form, and then getting the bezier verticies from the DOM
  //convert the function to use bezier vertices to create the shape
  //THEN using that find a concentric fill algo that uses bezier verticies

  global_draw_start();
  bg_c = color("WHITE");
  png_bg(false);
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
    
      // show_shape_tiles(current_shape, shape_color);
    }
  }

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
  //if SVG, it will draw concentric rings to fill the shape based on the weight
  const max_fill_step = weight*3/4;
  const min_fill_step = weight/3; //with the PC-3M Posca, weight/4 is too close

  push();
  if(type == 'png'){
    noStroke();
    fill(shape_color);
    if(random()>0.8) blendMode(MULTIPLY);
  }
  else{
    const c = color(shape_color);
    c.setAlpha(alpha);
    stroke(c);
    noFill();
  }

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
  // const x_center = (x_max-x_min)/2 + x_min;
  // const y_center = (y_max-y_min)/2 + y_min;
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

  let first_loop = true;
  while(polar_shape.length>3){
    let sum_radii = 0;
    let min_radii = larger_base * 10;
    let max_radii = 0;

    if(type == "svg"){
      if(first_loop) fill(bg_c);
      else noFill();
    }
    beginShape();
    for(let i=0; i<polar_shape.length+3; i++){
      const pt = polar_shape[i%polar_shape.length];
      const x = pt.radius * cos(pt.theta);
      const y = pt.radius * sin(pt.theta);
      curveVertex(x,y);

      if(pt.radius<min_radii) min_radii = pt.radius;
      if(pt.radius>max_radii) max_radii = pt.radius;
      sum_radii += pt.radius;
    }
    endShape();

    // const avg_raddii = sum_radii/polar_shape.length;
  
    if(type == "svg"){
      for(let i=polar_shape.length-1; i>=0; i--){
        const pt = polar_shape[i];
        let fill_step = map(pt.radius, min_radii,max_radii, min_fill_step, max_fill_step);
        if(max_radii-min_radii < weight) fill_step = (max_fill_step-min_fill_step)/2 + min_fill_step;
        pt.radius -= fill_step;
        if(pt.radius < weight){
          polar_shape.splice(i,1);
        }
      }
    }
    first_loop = false;
    if(type == "png") break;
  }

  pop();
}

function generate_shape(shapes, iterator, total_iterations){
  const tiles = create_noise_tiles(
    iterator, 
    lerp(0.35,0, iterator/total_iterations), 
    lerp(0.65,1, iterator/total_iterations)
  );
  const parsed = parse_tiles(tiles);
  shapes.push(...parsed);
}

function create_noise_tiles(iterator, lower_noise_max=.35, upper_noise_min=0.65, col_damp=500*global_scale, row_damp=500*global_scale, z_damp=1){
  //noise map based
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