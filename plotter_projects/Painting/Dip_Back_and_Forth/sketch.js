'use strict';

//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;

function gui_values(){
  parameterize("dip_radius", 96/4, 0, 1.025*96, 0.1, false);
}

function setup() {
  common_setup((12+5/32)*96, 8.5*96, SVG);
}
//***************************************************
function draw() {
  global_draw_start();
  const container_radius = 1.25*96; //2.5 inch diameter circles for spyhouse bottoms
  push();
  translate(container_radius, 0);

  beginShape();
  vertex(0,0);
  vertex(dip_radius,0);
  vertex(-dip_radius,0);
  endShape(CLOSE);

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs