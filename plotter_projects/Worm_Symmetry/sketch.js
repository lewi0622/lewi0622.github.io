'use strict';
//setup variables
const gif = false;
const fr = 30;
const capture = false;
const capture_time = 15;

//project variables
const noise_off = 20;
let xoff = 0;
const inc = 0.1*60/fr;

let gui_params = [];

function gui_values(){

}

function setup() {
  common_setup(gif, SVG);
}
//***************************************************
function draw() {
  capture_start(capture);

  //bleed
  const bleed_border = apply_bleed();

  const sym_angs = floor(random(6,49));
  const line_segs = floor(random(20,51));

  stroke("BLACK");

  //actual drawing stuff
  push();
  for(let i=0; i<sym_angs; i++){
    push();
      translate(canvas_x/2, canvas_y/2);
      noFill();
      strokeWeight(1.5*global_scale);

      beginShape();
      for(let j=0; j<line_segs; j++){
        let dampening = 50;
        let x = floor(map(noise((j + xoff)/dampening), 0, 1, -canvas_x*.75, canvas_x*.75));
        let y = floor(map(noise((j + xoff + noise_off)/dampening), 0,1, -canvas_y*.75, canvas_y*.75));
        if(j == 0){
          curveVertex(x, y);
        }
        curveVertex(x, y);
      }
      endShape();
    pop();
    center_rotate(360/sym_angs);
  }

  xoff+= inc;

  pop();
  //cutlines
  apply_cutlines(bleed_border);
  capture_frame(capture);
}