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
  common_setup(0.5*96, 0.5*96);
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();

  push();

  line(0,0, 0.1, 0.1);

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs