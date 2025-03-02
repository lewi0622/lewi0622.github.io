'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 20;

let x_fourth, y_fourth, copic_palette;
const suggested_palettes = [BUMBLEBEE, SUMMERTIME, SOUTHWEST, JAZZCUP];
let font, img;
function preload(){
  img = loadImage('PXL_20240211_034853145.jpg');
  font = loadFont("../../fonts/Porcine-Heavy.ttf");
}

function gui_values(){
  parameterize("img_x", 0, -base_x/2, base_x/2, 1, true);
  parameterize("img_y", 0, -img.height/2, img.height/2, 1, true);
} 

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  image(img, img_x, img_y, img.width/2, img.height/2);
  pop();

  push();
  const stroke_c = random(working_palette);
  reduce_array(working_palette,stroke_c);
  stroke(stroke_c);
  strokeWeight(2*global_scale);
  fill(random(working_palette));
  textFont(font);
  textAlign(CENTER, CENTER);
  textSize(100*global_scale);
  translate(0,-18*global_scale);
  // text("PLOTTER PORTFOLIO", canvas_x/2, canvas_y/2);
  pop();

  global_draw_end();
}
//***************************************************
//custom funcs
