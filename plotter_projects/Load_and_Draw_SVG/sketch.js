'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = []
let my_svg;
let svg_width, svg_height, svg_viewbox;
function preload(){
  my_svg = loadSVG('Demo.svg', load_svg_attributes);
}

function load_svg_attributes(){
  svg_width = my_svg.elt.attributes.width.value;
  svg_height = my_svg.elt.attributes.height.value;
  svg_viewbox = my_svg.elt.attributes.viewBox.value.split(" ");
}

function gui_values(){
}

function setup() {
  common_setup(svg_viewbox[2], svg_viewbox[3], SVG);
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();

  image(my_svg, 0, 0, width, height);


  pop();

  global_draw_end();
}
//***************************************************
//custom funcs
