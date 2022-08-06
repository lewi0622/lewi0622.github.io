'use strict';
//setup variables
const gif = false;
const fr = 1;
const capture = false;
const capture_time = 8

function setup() {
  common_setup(gif, SVG);
}
//***************************************************
function draw() {
  capture_start(capture);
  //bleed
  const bleed_border = apply_bleed();

  const colors = gen_n_colors(2);
  //actual drawing stuff
  push();

  strokeWeight(1*global_scale);

  noFill();

  translate(canvas_x/2, canvas_y/2);
  const num_circles = 25;
  stroke(colors[0]);
  for(let i=0; i<num_circles; i++){
    rotate(20);
    push();
    if(i%4==0){
      fill(colors[1]);
    }
    circle(0,i*global_scale*5, 5*global_scale*i + 5*global_scale);
    pop();
  } 
  
  pop();

  //cleanup
  apply_cutlines(bleed_border);

  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs


