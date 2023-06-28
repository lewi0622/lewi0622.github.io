'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 30;
const capture = false;
const capture_time = 8;

//project variables
// const phase_off = 20;

function gui_values(){
  parameterize("i_mult_coarse", random([0, 1.5, 2.5,  5, 10, 20, 30, 40, 120]), 0, 120, 1, false);
  parameterize("i_mult_fine", 0, -1, 1, 0.0001, false);
  parameterize("i_mult_inc", 0.000003, 0.000001, 0.000100, 0.000001, false);
  parameterize("noise_maximum", 2, 0, 5, 0.1, false);
  parameterize("step_size", 3, 1, 50, 1, false);
  parameterize("step_num", 720, 10, 1500, 20, false);
  parameterize("rotation", 0, 0, 360, 1, false);
  parameterize("line_size", 300, 100, 1500, 10, true);
  parameterize("phase_off", 20, 0, 20, 0.1, false);
  parameterize("octaves", 4, 1, 20, 1, false);
  parameterize("falloff", 0.5, 0, 1, 0.01, false);
  parameterize("tightness", 0, -5, 5, 0.1, false);
  parameterize("x_translate", 0, -400, 400, 1, true);
  parameterize("y_translate", 0, -400, 400, 1, true);
}

function setup() {
  if(!capture){
    common_setup(11*96, 8.5*96, SVG);
  }
  else{
    common_setup();
    background("WHITE")
  }
  // noFill();
  // strokeWeight(COPICMARKER*3/4);
  // strokeWeight(0.0944882*96);
  angleMode(DEGREES);
}
//***************************************************
function draw() {
  global_draw_start();

  if(capture){
    background("WHITE");
  }


  //actual drawing stuff
  push();
  curveTightness(tightness);
  noiseDetail(octaves, falloff);
  center_rotate(rotation);
  let working_i_mult = i_mult_coarse + i_mult_fine;

  translate(canvas_x/2+x_translate, canvas_y/2+y_translate);
  // beginShape();
  for(let i=0; i<step_num; i+=step_size){
    let xoff = map(cos(i*working_i_mult), -1,1, 0, noise_maximum);
    let yoff = map(sin(i*working_i_mult), -1,1, 0, noise_maximum);
    const x = map(noise(xoff, yoff), 0,1, -line_size,line_size)
    
    xoff = map(cos((i+phase_off)*working_i_mult), -1,1, 0, noise_maximum);  
    yoff = map(sin((i+phase_off)*working_i_mult), -1,1, 0, noise_maximum);
    const y = map(noise(xoff, yoff), 0,1, -line_size,line_size)
    // curveVertex(x, y)
    circle(x,y, 50*global_scale);
    working_i_mult += i_mult_inc;

    }
  // endShape();
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs