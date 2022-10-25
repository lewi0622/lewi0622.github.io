'use strict';
//setup variables
const gif = false;
const fr = 1;
const capture = false;
const capture_time = 8;


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

  //actual drawing stuff
  push();

  strokeWeight(1*global_scale);
  noFill();

  translate(canvas_x/2, canvas_y/2);

  const min_radius = 5*global_scale;


  for(let j=0; j<2; j++){
    stroke(random(255))
    let radius = canvas_x/2;
    const dec = random(1,5)*global_scale;
    beginShape();
    while(radius>min_radius){
      for(let i=0; i<4; i++){
        const x = radius*cos(i*90);
        const y = radius*sin(i*90);
        vertex(x, y);
        radius -= dec;
      }
    }
    endShape();
  }

  pop();

  //cleanup
  apply_cutlines(bleed_border);

  capture_frame(capture);
}
//***************************************************
//custom funcs


