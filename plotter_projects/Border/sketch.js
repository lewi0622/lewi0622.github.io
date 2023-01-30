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
  common_setup(gif, SVG, 1056, 816);
}
//***************************************************
function draw() {
  capture_start(capture);
  //bleed
  const bleed_border = apply_bleed();

  //actual drawing stuff
  push();

  rect(0,0, canvas_x, canvas_y);

  pop();

  //cleanup
  apply_cutlines(bleed_border);

  capture_frame(capture);
}
//***************************************************
//custom funcs


