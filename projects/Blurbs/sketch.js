'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

suggested_palettes = [SAGEANDCITRUS, COTTONCANDY, SUPPERWARE]

function gui_values(){
  parameterize("Weight", 10, 0.1, 100, 0.1, true, grid_slider_1);
  parameterize("Line_length", 60, 10, 100, 0.1, true, grid_slider_2);
  parameterize("Rotation", random([0,90,180,270]), 0, 270, 90, false, grid_slider_3);  
  parameterize("iterations", 1, 1, 20, 1, false, grid_slider_4);
}

function setup() {
  common_setup();
}
//***************************************************
function draw() {
  global_draw_start();

  //projct variables
  const tile_width = canvas_x / Line_length;
  const tile_height = canvas_y / Line_length;
  let funcs, colors, x_offset_min, x_offset_max, y_offset_min, y_offset_max;

  refresh_working_palette();

  //apply background
  let bg_c = random(working_palette);
  background(bg_c)
  reduce_array(working_palette, bg_c)

  //actual drawing stuff
  push();
  center_rotate(Rotation);

  //line width
  strokeWeight(Weight);

  //tile lines
  tile(tile_width, tile_height, Line_length, funcs=[draw_diag, draw_cardinal], 
    colors=working_palette, iterations, 
    x_offset_min=0, x_offset_max=0,
    y_offset_min=0, y_offset_max=0);
  
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs




