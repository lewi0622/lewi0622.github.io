'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [BUMBLEBEE];

function gui_values(){
  parameterize("num_circles", random(30,300), 1, 500, 1, false);
  parameterize("circle_steps", random(50,300), 3, 300, 1, false);
  parameterize("radius_start", random(50), 0, 200, 1, true);
  parameterize("circle_radius_inc", random(-5,5), -10, 10, 0.1, true);
  parameterize("step_radius_inc", random(-2,2), -10, 10, 0.1, true);
} 

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  const bg_c = random(working_palette);
  reduce_array(working_palette, bg_c);
  if(type == "png") {
    background(bg_c);
    stroke(random(working_palette));
  }
  noFill();
  const ang_step = 360/circle_steps;
  translate(canvas_x/2, canvas_y/2);
  for(let i=0; i<num_circles; i++){
    strokeWeight(random(1,20)*global_scale);
    stroke(random(working_palette));
    rotate(map(noise(i/1000), 0,1, 0,360));
    beginShape();
    let radius =  i * circle_radius_inc + radius_start;
    let actual_steps = random(circle_steps/2, circle_steps);
    for(let j=0; j<actual_steps; j++){
      const theta = j*ang_step;
      radius += step_radius_inc;
      let x = radius*cos(theta);
      let y = radius*sin(theta);

      vertex(x,y);
    }
    endShape();
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs