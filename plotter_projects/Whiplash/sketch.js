'use strict';
//setup variables
const gif = false;
const fr = 30;
const capture = false;
const capture_time = 8;

//project variables
const phase_off = 20;
// let i_mult;


function gui_values(){
  parameterize("i_mult_coarse", random([0, 1.5, 2.5,  5, 10, 20, 30, 40, 120]), 0, 120, 1, false);
  parameterize("i_mult_fine", 0, 0, 1, 0.0001, false);
  parameterize("noise_maximum", 2, 0, 5, 0.1, false);
}

function setup() {
  if(!capture){
    common_setup(gif, SVG);
  }
  else{
    common_setup(gif);
  }
  noFill();
  strokeWeight(1.5)
  angleMode(DEGREES)
}
//***************************************************
function draw() {
  capture_start(capture);
  clear();
  if(capture){
    background("WHITE");
  }
  //bleed
  const bleed_border = apply_bleed();

  //actual drawing stuff
  push();

  let working_i_mult = i_mult_coarse + i_mult_fine;

  translate(canvas_x/2, canvas_y/2);
  const line_size = 300*global_scale;
  const step_size = 3;
  beginShape();
  for(let i=0; i<720; i+=step_size){
    let xoff = map(cos(i*working_i_mult), -1,1, 0, noise_maximum);
    let yoff = map(sin(i*working_i_mult), -1,1, 0, noise_maximum);
    const x = map(noise(xoff, yoff), 0,1, -line_size,line_size)
    
    xoff = map(cos((i+phase_off)*working_i_mult), -1,1, 0, noise_maximum);  
    yoff = map(sin((i+phase_off)*working_i_mult), -1,1, 0, noise_maximum);
    const y = map(noise(xoff, yoff), 0,1, -line_size,line_size)
    curveVertex(x, y)
    
    working_i_mult += 0.000003

    }
  endShape();
  pop();
  //cleanup
  apply_cutlines(bleed_border);
  
  capture_frame(capture);
}
//***************************************************
//custom funcs