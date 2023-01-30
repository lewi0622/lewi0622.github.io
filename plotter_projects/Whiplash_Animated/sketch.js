'use strict';
//setup variables
const gif = true;
const animation = false;
const fr = 30;
const capture = false;
const capture_time = 8;
let i_mult, i_mult_inc;

function gui_values(){
  parameterize("noise_maximum", 2, 0, 5, 0.1, false);
  parameterize("step_size", 3, 1, 50, 1, false);
  parameterize("step_num", 720, 10, 1500, 20, false);
  parameterize("rotation", 0, 0, 360, 1, false);
  parameterize("line_size", 300, 100, 500, 10, true);
  parameterize("phase_off", 20, 0, 20, 0.1, false);
}

function setup() {
  common_setup(gif);

  //project variables
  i_mult = random([0, 1.5, 2.5,  5, 10, 20, 30, 40, 120]);
  i_mult_inc = 0.000003;

  noFill();
  strokeWeight(0.5*global_scale);
  angleMode(DEGREES)
}
//***************************************************
function draw() {
  capture_start(capture);
  clear();
  background("WHITE");
  //bleed
  const bleed_border = apply_bleed();

  //actual drawing stuff
  push();
  center_rotate(rotation);
  // let working_i_mult = i_mult_coarse + i_mult_fine;

  translate(canvas_x/2, canvas_y/2);
  beginShape();
  for(let i=0; i<step_num; i+=step_size){
    let xoff = map(cos(i*i_mult), -1,1, 0, noise_maximum);
    let yoff = map(sin(i*i_mult), -1,1, 0, noise_maximum);
    const x = map(noise(xoff, yoff), 0,1, -line_size,line_size)
    
    xoff = map(cos((i+phase_off)*i_mult), -1,1, 0, noise_maximum);  
    yoff = map(sin((i+phase_off)*i_mult), -1,1, 0, noise_maximum);
    const y = map(noise(xoff, yoff), 0,1, -line_size,line_size)
    curveVertex(x, y)
    
    i_mult += i_mult_inc;

    }
  endShape();
  pop();
  //cleanup
  apply_cutlines(bleed_border);
  
  capture_frame(capture);
}
//***************************************************
//custom funcs