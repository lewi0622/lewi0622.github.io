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
  parameterize("text_size", 32, 1, 500, 1, true);
}

function setup() {
  common_setup();
  gui_values();

  textFont(font);
}
//***************************************************
function draw() {
  global_draw_start();
  push();
  textSize(text_size);
  translate(0*global_scale, canvas_y/2)
  text("Lewiston", 0,0);
  translate(text_size*2.4, -text_size/2);
  rotate(80);
  text(":D", 0, 0)

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs