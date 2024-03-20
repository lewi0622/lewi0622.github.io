'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [BEACHDAY, COTTONCANDY, SOUTHWEST]


function gui_values(){

}

function setup() {
  common_setup();
}
//***************************************************
function draw() {
  global_draw_start();

  //project variables
  const up_scale = global_scale/2;

  const line_length = 60*up_scale;
  const tile_width = canvas_x / line_length;
  const tile_height = canvas_y / line_length;
  let funcs, colors, iterations, x_offset_min, x_offset_max, y_offset_min, y_offset_max;

  //apply background
  background(random(working_palette));
  strokeCap(random([PROJECT,ROUND]));

  //actual drawing stuff
  push();
  center_rotate(random([0,90,180,270]));

  strokeWeight(75*up_scale);

  tile(tile_width, tile_height, line_length, funcs=[draw_diag, draw_cardinal], 
    colors=palette, iterations=1, 
    x_offset_min=0, x_offset_max=0,
    y_offset_min=0, y_offset_max=0);

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
