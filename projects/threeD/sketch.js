'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
suggested_palettes = [SAGEANDCITRUS, COTTONCANDY, SUPPERWARE]

function gui_values(){
  parameterize("rotX", 0, 0, 360, 1, false);
  parameterize("rotY", 0, 0, 360, 1, false);
  parameterize("rotZ", 0, 0, 360, 1, false);
}

function setup() {
  common_setup(gif, WEBGL);
}
//***************************************************
function draw() {
  capture_start(capture);
  //bleed
  const bleed_border = apply_bleed();

  refresh_working_palette();

  //apply background
  let bg_c = random(working_palette);
  background(bg_c)
  reduce_array(working_palette, bg_c)

  //actual drawing stuff
  push();
  
  // square(0,0,100*global_scale);
  translate(0,0,-100);
  rotateX(330);
  rotateY(130);
  translate(0,0,-100*global_scale);
  rotateX(rotX);
  rotateY(rotY);
  rotateZ(rotZ);
  for(let j=0; j<50; j++){
    translate(0, 0, 100);
  
    for(let i=0; i<75; i++){
      push();
      // noStroke();
      fill(random(working_palette));
      box(random(100*global_scale), random((30+j*10)*global_scale), random(100*global_scale));
      pop();
    }
  }
  pop();

  //cutlines
  apply_cutlines(bleed_border);
  capture_frame(capture);
}
//***************************************************
//custom funcs



