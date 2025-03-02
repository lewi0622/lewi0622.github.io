'use strict';

//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

function gui_values(){
  parameterize("num_steps", 500, 1, 10000, 1, false);
  parameterize("step_angle", 3, -360, 360, 5, false);
  parameterize("starting_rad", 5, -base_x, base_x, 1, true);
  parameterize("step_radius", 1, 0, 20, 0.1, true);
  parameterize("x_damp", 10 , 1, 1000, 1, true);
  parameterize("y_damp", 10 , 1, 1000, 1, true);
  parameterize("theta_damp", 10, 1, 50, 0.1, false);

  //10000, -45, -768, 0.3, 1000, 198, 1000
  //10000, -288, -768, 0.4, 1000, 1000, 1
}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();
  push();
  translate(canvas_x/2, canvas_y/2);
  noFill();
  strokeWeight(PILOTPRECISEV5);

  let radius = starting_rad;
  let theta = random(360);

  beginShape();
  for(let i=0; i<num_steps; i++){
    let x = radius * cos(theta);
    let y = radius * sin(theta);
    const actual_radius = map(noise(x/x_damp,y/y_damp, theta/theta_damp), 0,1, radius/2, radius*2);

    x = actual_radius * cos(theta);
    y = actual_radius * sin(theta);

    curveVertex(x,y);

    radius+=step_radius;
    theta+=step_angle;
  }
  endShape();

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs