'use strict';

//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;


function gui_values(){
}

function setup() {
  common_setup(1*96,1*96);
}
//***************************************************
function draw() {
  global_draw_start();
  push();
  const size_shape = 1*96;
  line(0,0, size_shape,0);
  line(size_shape,0, 0,0);

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs