'use strict';

//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;

function gui_values(){

}

function setup() {
  common_setup((12+5/32)*96, 8.5*96, SVG);
}
//***************************************************
function draw() {
  global_draw_start();

  push();
  const dip_radius = 96/8; //1/8th inch rad
  const container_radius = 1.25*96; //2.5 inch diameter circles for spyhouse bottoms
  // let c=1;
  translate(container_radius, 0);
  // for(let i=0; i<(canvas_x/container_radius)-2; i++){
  //   push();
  //   // stroke(c+i);
  //   translate(i*container_radius*2, 0);
  //   circle(0, 0, dip_radius);
  //   pop();
  // }
  circle(4*container_radius*2, 0, dip_radius);
  // circle(10.75*96, 7.5*96, 2.25*96/4); //dipping location, and dipping circle movement
  // circle(10.75*96, 5*96, 2.25*96/4);
  // circle(0,0,96/8);

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs