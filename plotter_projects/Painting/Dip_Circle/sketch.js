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
}
//***************************************************
function draw() {
  global_draw_start();

  push();

  translate(canvas_x/2, canvas_y/2);
  circle(0,0, 0.5*96);

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs