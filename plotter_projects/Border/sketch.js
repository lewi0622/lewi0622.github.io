'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 8;


function gui_values(){

}

function setup() {
  common_setup(1056, 816, SVG);
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();

  rect(0,0, canvas_x, canvas_y);

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs


