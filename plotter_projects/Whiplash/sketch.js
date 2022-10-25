'use strict';
//setup variables
const gif = true;
const fr = 30;
const capture = false;
const capture_time = 8;

//project variables
const noiseMax = 2;
const phase_off = 20;
let i_mult;

let gui_params = [];

function gui_values(){

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
  //cool stuff at 60
  i_mult = random([0, 1.5, 2.5,  5, 10, 20, 30, 40, 60])
  if(i_mult != 0){
    i_mult -= 0.1;
  }
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
  translate(canvas_x/2, canvas_y/2);
  const line_size = 300*global_scale;
  const step_size = 3;
  beginShape();
  for(let i=0; i<720; i+=step_size){
    let xoff = map(cos(i*i_mult), -1,1, 0, noiseMax);
    let yoff = map(sin(i*i_mult), -1,1, 0, noiseMax);
    const x = map(noise(xoff, yoff), 0,1, -line_size,line_size)
    
    xoff = map(cos((i+phase_off)*i_mult), -1,1, 0, noiseMax);  
    yoff = map(sin((i+phase_off)*i_mult), -1,1, 0, noiseMax);
    const y = map(noise(xoff, yoff), 0,1, -line_size,line_size)
    curveVertex(x, y)
    
    i_mult += 0.000003

    }
  endShape();
  pop();
  //cleanup
  apply_cutlines(bleed_border);
  
  capture_frame(capture);
}
//***************************************************
//custom funcs