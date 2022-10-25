'use strict';
//setup variables
const gif = false;
const fr = 1;
const capture = false;
const capture_time = 8;

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

  //actual drawing stuff
  push();

  strokeWeight(1*global_scale);
  noFill();

  translate(canvas_x/2, canvas_y/2);

  const min_radius = 15*global_scale;
  const noise_off = 20;
  stroke(random(255))
  for(let j=0; j<5; j++){

    let radius = canvas_x/2;
    const dec = 1*global_scale;
    beginShape();
    while(radius>min_radius){
      const points = 20;
      for(let i=0; i<points; i++){
        const x = radius*cos(i*(360/points));
        const y = radius*sin(i*(360/points));
        let noise_scale = radius/(canvas_x/2)*global_scale;
        const scale_factor = 6;
        if(radius == canvas_x/2){
          curveVertex(x,y);
          curveVertex(x,y);
        }
        else{
          curveVertex(x+map(noise(i*j), 0,1, -scale_factor,scale_factor)*noise_scale, y+map(noise(i*j+noise_off), 0,1, -scale_factor,scale_factor)*noise_scale);
        }
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


