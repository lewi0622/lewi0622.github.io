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
  common_setup(100, 80, SVG);

  textFont(font);
  textSize(32*global_scale);
}
//***************************************************
function draw() {
  global_draw_start();
  push();
  translate(0*global_scale, canvas_y/2)
  text("Lewiston", 0,0);
  rotate(80);
  text(":D", 0, -78*global_scale)

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs