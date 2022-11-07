'use strict';
let font;
function preload() {  font = loadFont('..\\..\\fonts\\SquarePeg-Regular.ttf');  }


//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 8


function gui_values(){

}

function setup() {
  common_setup(gif, SVG, 100, 80);

  textFont(font);
  textSize(32*global_scale);
}
//***************************************************
function draw() {
  capture_start(capture);
  //bleed
  const bleed_border = apply_bleed();
  push();
  translate(0*global_scale, canvas_y/2)
  text("Lewiston", 0,0);
  rotate(80);
  text(":D", 0, -78*global_scale)

  pop();
  //cleanup
  apply_cutlines(bleed_border);

  capture_frame(capture);
}
//***************************************************
//custom funcs