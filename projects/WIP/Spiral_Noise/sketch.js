'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 8;

function gui_values(){
  parameterize("total_steps", 1000, 1, 10000, 1, false);
  parameterize('angle_step_size', 10, 1, 90, 1, false);
  parameterize("min_radius", 1, 0, smaller_base, 1, true);
  parameterize("rotation", 0, 0, 360, 1, false);
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

  noFill();
  const weight = PITTPEN*global_scale;
  strokeWeight(weight);
  let c = random(working_palette);
  c = color(c);
  c.setAlpha(100);
  stroke(c);
  const circle_steps = floor(360/angle_step_size);
  const radii = new Array(circle_steps).fill(min_radius);

  translate(canvas_x/2, canvas_y/2);
  rotate(rotation);
  let theta = 0;

  beginShape();
  for(let i=0; i<total_steps; i++){
    const prev_radius = radii[i%circle_steps];
    theta += angle_step_size;
    const radius = map(noise(prev_radius/10000, (theta%360+1)/0.0001), 0,1, prev_radius + weight/2, prev_radius + 2*weight);

    const x = radius * cos(theta);
    const y = radius * sin(theta);
  

    curveVertex(x,y);
    radii[i%circle_steps] = radius;
  }
  endShape();

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs


