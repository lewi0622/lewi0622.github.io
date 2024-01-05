'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = []

function gui_values(){
  parameterize("circle_steps", floor(random(30, 1000)), 1, 1500, 10, false);
  parameterize("num_spirals", floor(random(30,100)), 1, 200, 1, false);
  parameterize("step_radius_per_circle", random(2,10), 0.1, 20, 0.01, true);
  parameterize("amp_sin", random(0.4,2), 0, 20, 0.1, true);
  parameterize("z_iterations", 3, 1, 10, 1, false);
  parameterize("the_x_factor", random(10,50) * random(-1,1), -500, 500, 1, false);
  parameterize("tightness", 0, -5, 5, 0.1, false);
} 

function setup() {
  common_setup(7*96, 7*96);
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();

  //actual drawing stuff
  push();
  if(type == "png") background("WHITE");
  noFill();
  stroke(0, 0, 0, 75);
  curveTightness(tightness);
  translate(canvas_x/2, canvas_y/2);

  for(let z=0; z<z_iterations; z++){
    let amplitude = map(z, 0, z_iterations, amp_sin, 0);
    const radius_step_size = step_radius_per_circle/circle_steps;
    let radius = radius_step_size * circle_steps;
    const spiral_steps = num_spirals*circle_steps;
    const theta_step_size = 360/circle_steps;
    beginShape();
    for(let i=0; i<spiral_steps; i++){
      const theta = i * theta_step_size;
      radius += radius_step_size + map(i, 0, spiral_steps/4, 0, amplitude) * sin(map(i, 0, spiral_steps, i, i*the_x_factor));

      const x = radius * cos(theta);
      const y = radius * sin(theta);
      curveVertex(x,y);
    }
    endShape();
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
