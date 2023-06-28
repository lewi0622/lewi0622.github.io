'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
suggested_palettes = [GAMEDAY, BIRDSOFPARADISE, OASIS]


function gui_values(){

}

function setup() {
  common_setup();
}
//***************************************************
function draw() {
  global_draw_start();

  //project variables
  const line_length = 60*global_scale;
  const tile_width = canvas_x / line_length;
  const tile_height = canvas_y / line_length;
  let funcs, colors, iterations, x_offset_min, x_offset_max, y_offset_min, y_offset_max;

  refresh_working_palette();
  strokeCap(random([PROJECT,ROUND]))

  //apply background
  const bg_c = random(working_palette)
  background(bg_c)
  reduce_array(working_palette, bg_c)

  //actual drawing stuff
  push();
  center_rotate(random([0,90,180,270]));

  //line width
  strokeWeight(10*global_scale);
  
  //tile lines
  tile(tile_width, tile_height, line_length, funcs=[draw_diag, draw_cardinal], 
    colors=working_palette, iterations=random([2,3]), 
    x_offset_min=0, x_offset_max=0,
    y_offset_min=0, y_offset_max=0);

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
