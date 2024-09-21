'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 30;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

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
  shape_1 = find_upper_left_tile(shape_1, num_cols, num_rows);


  show_grid(num_cols, num_rows, tile_size);
  show_shape_tiles(shape_1, tile_size);

  //start on upper left, moving to the right
  //find next tile in moving direction
  //specific check for inner corner
  //if no next tile, turn corner
  //end on upper left, moving up, generate last corner


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