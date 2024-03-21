'use strict';

//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;


function gui_values(){
  parameterize("size_shape", canvas_x/global_scale, 0, 10*96, 1, true);
}

function setup() {
  common_setup(1*96,1*96);
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();
  push();
  line(0,0, size_shape,0);
  line(size_shape,0, 0,0);

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs