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
  common_setup(gif, SVG,(12+5/32)*96, 8.5*96);
}
//***************************************************
function draw() {
  capture_start(capture);
  blendMode(modes[blend_mode]);
  clear();
  //bleed
  const bleed_border = apply_bleed();
  const container_radius = 1.25*96; //2.5 inch diameter circles for spyhouse bottoms
  push();
  translate(container_radius, 0);

  beginShape();
  vertex(0,0);
  vertex(dip_radius,0);
  vertex(-dip_radius,0);
  endShape(CLOSE);

  pop();
  //cutlines
  apply_cutlines(bleed_border);
  capture_frame(capture);
}
//***************************************************
//custom funcs