'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 8;


function gui_values(){
  parameterize("num_pts", floor(random(3,50)), 1, 100, 1, false);
  parameterize("num_steps", 400, 1, 1000, 1, false);
  parameterize("starting_radius", smaller_base/2, 0, smaller_base, 1, true);
  parameterize("tightness", 0, -5, 5, 0.1, false);
}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();
  push();

  const angle_step = 360/num_pts;
  translate(canvas_x/2, canvas_y/2);

  curveTightness(tightness);

  beginShape();
  for(let i=0; i<num_steps; i++){
    let radius = lerp(starting_radius, 0, i/num_steps);
    let x = radius * cos(i*2*angle_step);
    let y = radius * sin(i*2*angle_step);
    curveVertex(x,y);

    x = radius/2 * cos(i*2*angle_step + angle_step/2);
    y = radius/2 * sin(i*2*angle_step + angle_step/2);
    curveVertex(x,y);
  }
  endShape();

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs


