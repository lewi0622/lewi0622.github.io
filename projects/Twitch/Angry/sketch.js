'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 2;

const suggested_palettes = [BIRDSOFPARADISE];

let bg_c, line_c, confetti_c, shadow_c;

let weight, rotation_amount, line_length;
const num_lines = 7;
const rot_inc = 2.5;
let face_rotation;

let font;
function preload() { font = loadFont('..\\..\\..\\fonts\\SquarePeg-Regular.ttf'); }

function gui_values(){
}

function setup() {
  common_setup();
  gui_values();
  //parameter
  weight = 7*global_scale;
  rotation_amount = random(360);
  face_rotation = -60 * rot_inc - rotation_amount;
  line_length = 0;

  //colors
  // bg_c = random(working_palette);
  // reduce_array(working_palette, bg_c);
  bg_c = color("#18181b");

  line_c = random(working_palette);
  reduce_array(working_palette, line_c);
  line_c = color(line_c);

  shadow_c = color("#262626");

  textFont(font);
  background(bg_c);
}
//***************************************************
function draw() {
  global_draw_start(false);

  push();
  strokeCap(ROUND);
  strokeWeight(weight);
  const shake = 20 * global_scale;
  translate(canvas_x/2, canvas_y/2);

  push();
  if(frameCount > 1) line_c.setAlpha(100);
  fill(line_c);
  noStroke();
  circle(0,0, canvas_x*0.95);
  pop();

  translate(random(-shake, shake), random(-shake,shake));
  draw_face(400*global_scale);

  push();
  //red eyes
  const eye_color = color("RED");
  fill(eye_color);
  stroke(eye_color);
  drawingContext.shadowBlur= 10*global_scale;
  drawingContext.shadowColor = eye_color;
  
  const left_eye = {
    x:-115 * global_scale,
    y:-90 * global_scale
  };
  circle(left_eye.x, left_eye.y, 10*global_scale);
  circle(left_eye.x, left_eye.y, 10*global_scale);
  const right_eye = {
    x:-30 * global_scale,
    y:-100 * global_scale
  };
  circle(right_eye.x, right_eye.y, 10*global_scale);
  circle(right_eye.x, right_eye.y, 10*global_scale);
  pop();

  pop();
  if(frameCount>=60) randomize_seed();

  rotation_amount += rot_inc;
  global_draw_end();
}
//***************************************************
//custom funcs
function draw_face(size){
  //Draws LewistonFace centerd on current point
  textSize(size);

  const x_adjust = -7/20 * size;
  const y_adjust = -6/20 * size;

  push();
  translate(x_adjust, y_adjust);
  rotate(80);
  strokeWeight(1*global_scale);

  stroke("BLACK");
  text(":D", 0, 0);

  pop();
}