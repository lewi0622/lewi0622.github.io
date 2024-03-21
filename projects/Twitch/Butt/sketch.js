'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 10;

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
  refresh_working_palette();
  bg_c = random(working_palette);
  reduce_array(working_palette, bg_c);

  line_c = random(working_palette);
  reduce_array(working_palette, line_c);

  shadow_c = color("#262626");

  textFont(font);
}
//***************************************************
function draw() {
  global_draw_start();

  push();
  background(bg_c);
  strokeCap(ROUND);
  stroke(line_c);
  strokeWeight(weight);

  translate(canvas_x/2, canvas_y/2);
  rotate(rotation_amount);

  if(frameCount<30){
    draw_butthole(true);
    line_length = lerp(50,150, frameCount/30) * global_scale;
    weight = lerp(7, 50, frameCount/30) * global_scale;
  }
  else{
    draw_butthole(true);
    const pct = map(frameCount, 30, 60, 0, 1);
    line_length = lerp(150,300, pct) * global_scale;
    weight = lerp(50, 225, pct) * global_scale;
    push();
    rotate(face_rotation);
    drawingContext.shadowBlur = 1*global_scale;
    drawingContext.shadowColor = color(shadow_c);
    drawingContext.shadowOffsetX = 2.5*global_scale;
    drawingContext.shadowOffsetY = 2.5*global_scale;
    draw_face(lerp(0, 200, pct) * global_scale);
    pop();
  }
  pop();

  if(frameCount>=60) randomize_seed();

  rotation_amount += rot_inc;
  global_draw_end();
}
//***************************************************
//custom funcs
function draw_butthole(shadow){
  const ang_step = 360/num_lines;
  if(shadow){
    for(let i=0; i<num_lines; i++){
      push();
      translate(5*global_scale, 5*global_scale);
      rotate(i*ang_step);
      stroke(working_palette[0]);
      line(0,0, line_length, 0);
      pop();
    }
  }
  for(let i=0; i<num_lines; i++){
    push();
    rotate(i*ang_step);
    stroke(line_c);
    line(0,0, line_length, 0);
    pop();
  }
}

function draw_face(size){
  //Draws LewistonFace centerd on current point
  textSize(size);

  const x_adjust = -7/20 * size;
  const y_adjust = -7/20 * size;

  push();
  translate(x_adjust, y_adjust);
  rotate(80);
  strokeWeight(1*global_scale);

  stroke("BLACK");
  text(":D", 0, 0)
  pop();
}