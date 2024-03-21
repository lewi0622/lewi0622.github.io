'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

let x_fourth, y_fourth;
const suggested_palettes = [COTTONCANDY, GAMEDAY, BIRDSOFPARADISE]

function gui_values(){

}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();

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
  global_draw_end();
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