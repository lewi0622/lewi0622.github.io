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
  common_setup(gif, P2D, 400, 600);
}
//***************************************************
function draw() {
  capture_start(capture);
  //bleed
  const bleed_border = apply_bleed();

  //resize svg to fit canvas
  let clip_path = document.getElementById("myClip");
  clip_path.setAttribute("width", String(canvas_x));
  clip_path.setAttribute("height", String(canvas_y));

  //actual drawing stuff
  push();

  background("BLUE");
  strokeWeight(10);
  line(0, canvas_y/2, canvas_x, canvas_y/2);

  pop();


  //cleanup
  apply_cutlines(bleed_border);

  capture_frame(capture);
}
//***************************************************
//custom funcs
