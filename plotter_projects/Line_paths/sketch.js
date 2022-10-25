'use strict';
//setup variables
const gif = true;
const fr = 1;
const capture = false;
const capture_time = 8;
//project variables
const noiseMax = 2;
let phase = 0;
const phase_off = 20;
const phase_inc = 0.01;
let c_offset = 0;
let weight;


function gui_values(){

}

function setup() {
  common_setup(gif, SVG);

  noFill();
  weight = 10*global_scale;
  strokeWeight(weight);
  strokeCap(ROUND);
  angleMode(DEGREES);
}
//***************************************************
function draw() {
  clear();
  //bleed
  const bleed_border = apply_bleed();

  //actual drawing stuff
  push();

  translate(canvas_x, canvas_y);
  const line_dist = weight*3/4;
  const x_offset = 80*global_scale;
  const y_offset = -80*global_scale;

  let c_loop = c_offset;

  for(let j=0; j<40; j++){
    const c = palette[c_loop%palette.length];
    c_loop++;
    // c[3] = 100;
    stroke(c);
    for(let i=0; i<40; i++){
      push();
      translate(-line_dist*i, -line_dist*j);
      if(random()>0.7){
        line(0,0,x_offset,y_offset);
      }
      pop();
    }
  }

  c_offset++;

  pop();
  //cleanup
  apply_cutlines(bleed_border);
}
//***************************************************
//custom funcs