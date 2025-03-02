'use strict';

//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

function gui_values(){
  parameterize("cols", 12, 1, 200 , 1, false);
  parameterize("rows", 12, 1, 200 , 1, false);  
  parameterize("iterations", 3, 1, 1000, 1, false);
  parameterize("num_colors", round(random(1, working_palette.length-1)), 1, working_palette.length-1, 1, false);
}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();
  push();
  png_bg(true);
  strokeWeight(5*global_scale);
  const grid = [];
  const step_size = canvas_x/cols;

  translate(step_size/2, step_size/2);
  rectMode(CENTER);
  noFill();

  let overall_index = 0;
  for(let i=0; i<cols; i++){
    const col = [];
    for(let j=0; j<rows; j++){
      push();
      translate(i*step_size, j*step_size);
      // square(0,0, step_size);
      col.push({
        x: i*step_size,
        y: j*step_size,
        occupied: false,
        index: overall_index
      });
      overall_index++;
      pop();
    }
    grid.push(col);
  }

  const colors = [];
  const current_tiles = [];
  for(let i=0; i<num_colors; i++){
    colors.push(color(working_palette[i]));
    // colors[i].setAlpha(150);

    current_tiles.push(floor(random(overall_index)));
    const [col_index, row_index] = find_current_tile(current_tiles[i]);
    const tile_obj = grid[col_index][row_index];
    tile_obj.occupied = true;
  }

  const draw_tiles = [];
  const tile_pts = [];
  for(let i=0; i<current_tiles.length; i++){
    tile_pts.push([]);
    draw_tiles.push(true);
  }

  for(let i=0; i<iterations; i++){
    for(let j=0; j<current_tiles.length; j++){
      if(!draw_tiles[j]) continue;
      const [col_index, row_index] = find_current_tile(current_tiles[j]);
      const tile_obj = grid[col_index][row_index];
      tile_pts[j].push({x:tile_obj.x, y:tile_obj.y});
      tile_obj.occupied = true;
      const unoccupied_neighbors = find_unoccupied_neighbors(current_tiles[j], grid);
  
      if(unoccupied_neighbors.length == 0){
        draw_tiles[j] = false;
      }
      else{
        current_tiles[j] = random(unoccupied_neighbors).index;
      }
    }
  }

  for(let i=0; i<tile_pts.length; i++){
    stroke(colors[i]);
    beginShape();
    for(let j=0; j<tile_pts[i].length; j++){
      const pts = tile_pts[i][j];
      if(j==0 || j+1 == tile_pts[i].length) curveVertex(pts.x, pts.y);
      curveVertex(pts.x, pts.y);
    }
    endShape();
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs

function find_unoccupied_neighbors(index, grid){
  const neighbors = find_neighbors(index);
  const unoccupied_neighbors = [];
  for(let i=0; i<neighbors.length; i++){
    const neighbor = grid[neighbors[i][0]][neighbors[i][1]];
    if(!neighbor.occupied){
      neighbor["direction"] = find_relative_direction(index, neighbor.index);
      neighbor["wrap"] = check_wrap(index, neighbor.index);
      unoccupied_neighbors.push(neighbor);
    } 
  return unoccupied_neighbors;
  }
}

function find_current_tile(index){
  const col_index = floor(index/rows);
  const row_index =  round(index-(col_index*rows));
  return [col_index, row_index];
}

function find_neighbors(index){
  const [col_index, row_index] = find_current_tile(index);
  const neighbors = [];
  if(col_index == 0){
    neighbors.push([col_index+1, row_index]);
    neighbors.push([cols-1, row_index]);
  }
  else if(col_index == cols-1){
    neighbors.push([col_index-1, row_index]);
    neighbors.push([0, row_index]);
  }
  else{
    neighbors.push([col_index-1, row_index]);
    neighbors.push([col_index+1, row_index]);
  }

  if(row_index == 0){
    neighbors.push([col_index, row_index+1]);
    neighbors.push([col_index, rows-1]);
  }
  else if(row_index == rows-1){
    neighbors.push([col_index, row_index-1]);
    neighbors.push([col_index, 0]);
  }
  else{
    neighbors.push([col_index, row_index+1]);
    neighbors.push([col_index, row_index-1]);
  }

  return neighbors;
}

function find_relative_direction(start, end){
  [start_col_index, start_row_index] = find_current_tile(start);
  [end_col_index, end_row_index] = find_current_tile(end);
}

function check_wrap(start, end){
  
}