'use strict';

//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;

function gui_values(){
  parameterize("line_steps", 100, 1, 1000, 1, false);
  parameterize("noise_damp", 10, 1, 1000, 1, false);
  parameterize("noise_amp", 10, 1, 100, 1, true);
  parameterize("rotation_steps", 50, 1, 500, 1, false);
  parameterize("rotation_step_size", 1, -180, 180, 1, false);
}

function setup() {
  common_setup(gif, SVG, 6*96, 6*96);
}
//***************************************************
function draw() {
  capture_start(capture);
  //bleed
  const bleed_border = apply_bleed();

  //actual drawing stuff
  push();
  
  translate(canvas_x/2, canvas_y/2);
  const line_step_size = canvas_x/line_steps;
  for(let j=0; j<rotation_steps; j++){
    push();
    rotate(j*rotation_step_size);
    translate(-canvas_x/2, 0);
    const line_chance = map(j, 0, rotation_steps, 1, 0.5);
    for(let i=1; i<=line_steps; i++){
      if(random()>line_chance) continue;
      line(i*line_step_size, map(noise(i/noise_damp), 0,1, -noise_amp, noise_amp),
      (i+1)*line_step_size, map(noise((i+1)/noise_damp), 0,1, -noise_amp, noise_amp))
    }
    pop();
  }
  pop();

  //cutlines
  apply_cutlines(bleed_border);
  capture_frame(capture);
}
//***************************************************
//custom funcs