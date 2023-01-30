'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 8
suggested_palettes = [BUMBLEBEE, SIXTIES, SUPPERWARE]


function gui_values(){

}


function setup() {
  common_setup(gif, SVG, 1100, 850);
}
//***************************************************
function draw() {
  capture_start(capture);

  //project variables
  const line_length = 60*global_scale;
  const tile_width = canvas_x / line_length;
  const tile_height = canvas_y / line_length;

  let funcs, colors, iterations;
  let x_offset_min = 0;
  let x_offset_max = 100;
  let y_offset_min = 0;
  let y_offset_max = 100;
  

  //bleed
  const bleed_border = apply_bleed();

  background("#abada0")
  refresh_working_palette();
  strokeCap(random([PROJECT,ROUND]))

  //actual drawing stuff
  push();
  center_rotate(random([0, 90, 180, 270]));
  //line width
  strokeWeight(2*global_scale);
  
  //tile lines
  tile(tile_width, tile_height, line_length, funcs=[draw_diag, draw_cardinal], 
    colors=working_palette, iterations=50, 
    x_offset_min=x_offset_min*global_scale, x_offset_max=x_offset_max*global_scale,
    y_offset_min=y_offset_min*global_scale, y_offset_max=y_offset_max*global_scale);

  pop();
  //cutlines
  apply_cutlines(bleed_border);

  capture_frame(capture);
}
//***************************************************
//custom funcs