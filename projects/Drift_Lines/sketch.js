'use strict';
//setup variables
const gif = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
let suggested_palette;

function setup() {
  suggested_palette = random([BUMBLEBEE, SIXTIES, SUPPERWARE]);
  common_setup(gif);
}
//***************************************************
function draw() {
  capture_start(capture);

  //project variables
  const line_length = 60*global_scale;
  const tile_width = canvas_x / line_length;
  const tile_height = canvas_y / line_length;

  let i_offset = 0;
  let j_offset = 0;

  let x_offset_min = 0;
  let x_offset_max = 20;
  let y_offset_min = 0;
  let y_offset_max = 20;
  let funcs, colors, iterations;

  //bleed
  const bleed_border = apply_bleed();

  let working_palette = JSON.parse(JSON.stringify(palette));
  strokeCap(random([PROJECT,ROUND]))

  //apply background
  let bg_c = random(working_palette)
  background(bg_c)
  reduce_array(working_palette, bg_c)

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

  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs