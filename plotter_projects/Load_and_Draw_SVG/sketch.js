'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

suggested_palettes = []
let my_svg;
function preload(){
  my_svg = loadSVG('Demo.svg');
}

function gui_values(){
}

function setup() {
  common_setup(6*96, 8*96, SVG);
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();

  image(my_svg, 0,0, width, height);


  pop();

  global_draw_end();
}
//***************************************************
//custom funcs
