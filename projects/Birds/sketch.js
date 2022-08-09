'use strict';
//setup variables
const gif = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
let suggested_palette, working_palette, x_fourth, y_fourth;

function setup() {
  suggested_palette = random([COTTONCANDY, GAMEDAY, BIRDSOFPARADISE]);
  common_setup(gif);
}
//***************************************************
function draw() {
  capture_start(capture);

  //bleed
  const bleed_border = apply_bleed();

  working_palette = JSON.parse(JSON.stringify(palette));

  //apply background
  let bg_c = random(working_palette)
  background(bg_c)
  reduce_array(working_palette, bg_c)

  //actual drawing stuff
  push();
  //correction for scaling
  x_fourth = ceil(canvas_x/4);
  y_fourth = ceil(canvas_y/4);

  noStroke();
  push();
  //head and eye
  translate(x_fourth, y_fourth);
  head();
  // beak
  translate(x_fourth, 0);
  beak();
  pop();

  push();
  //head and eye
  translate(x_fourth*3, y_fourth*3);
  head();
  // beak
  translate(-x_fourth, 0);
  beak(true);
  pop();

  pop();
  //cleanup
  apply_cutlines(bleed_border);

  capture_frame(capture);
}
//***************************************************
//custom funcs
function head(){
  fill(random(working_palette));
  square(-x_fourth, -x_fourth, x_fourth*2);
  fill('#FFFFFF');
  const eye_size = random(75,125);
  circle(0,0, eye_size*global_scale);
  fill(random(palette))
  circle(0,0,eye_size*3/4*global_scale);
  fill('#000000');
  circle(0,0,eye_size*1/2*global_scale);
}
function beak(reverse){
  let rev;
  if(reverse==true){
    rev = -1;
  }
  else{
    rev = 1;
  }
  fill(random(working_palette));
  triangle(0,0, 0,floor(-y_fourth), floor(x_fourth*2*rev),0);
  fill(random(working_palette));
  triangle(0,0, 0,y_fourth, x_fourth*2*rev,0);
}