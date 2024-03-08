'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 8;

function gui_values(){
  parameterize("num_spirals", 2, 1, 5, 1, false);
  parameterize("radius", 100, 0, 200, 1, true);
  parameterize("min_radius", 15, 0, 100, 1, true);
  parameterize("tightness", 1, 0.1, 5, 0.05, true);
  parameterize("x_offset", 0, -100, 100, 5, true);
  parameterize("y_offset", 0, -100, 100, 5, true);
}

function setup() {
  common_setup(6*96, 6*96);
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();

  strokeWeight(1*global_scale);
  noFill();
  let phase_shift = 0;
  translate(canvas_x/2, canvas_y/2);
  for(let j=0; j<num_spirals; j++){
    push();
    translate(j*x_offset, j*y_offset);
    if(j+1==num_spirals)phase_shift=180;//rotate(180);
    stroke(random(100))
    let working_radius = radius;
    beginShape();
    while(working_radius>min_radius){
      const points = 20;
      for(let i=0; i<points; i++){
        const x = working_radius*cos(i*(360/points)+phase_shift);
        const y = working_radius*sin(i*(360/points)+phase_shift);
        let noise_scale = working_radius/(canvas_x/2)*global_scale;
        const scale_factor = 6;
        // if(radius == canvas_x/2){
          // curveVertex(x,y);
        curveVertex(x,y);
        // }
        // else{
        //   curveVertex(x+map(noise(i*j), 0,1, -scale_factor,scale_factor)*noise_scale, y+map(noise(i*j+noise_off), 0,1, -scale_factor,scale_factor)*noise_scale);
        // }
        working_radius -= tightness;
      }
    }
    endShape();
    pop();
  }

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs


