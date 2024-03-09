'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 10;

const suggested_palettes = [BUMBLEBEE];

let z;
let bg_c, stroke_c;
const z_inc = 0.01;

function gui_values(){
  parameterize("num_rings", 10, 1, 50, 1, false);
  parameterize("ring_size", 20, 1, 100, 1, true);
  parameterize("ring_starting_radius", 50, 1, 400, 1, true);
  parameterize("starting_ang_steps", 250, 1, 400, 1, false);
  if(type == "svg") parameterize("z_val", z, 0, 50, z_inc, false);
}

function setup() {
  common_setup();
  refresh_working_palette();
  bg_c = bg(true);
  stroke_c = random(working_palette);
  z = 0;
  if(type == "svg") noLoop();
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  if(type=="png") background(bg_c);

  translate(canvas_x/2, canvas_y/2);

  stroke(stroke_c);
  for(let i=0; i<num_rings; i++){
    const ang_steps = floor(starting_ang_steps * map(i, 0, num_rings, 1, 5));
    const ang_step_size = 360/ang_steps;
    for(let j=0; j<ang_steps; j++){
      const theta = j * ang_step_size + map(noise(i,j/50, z), 0,1, -ang_step_size, ang_step_size);
      const radius_start = ring_starting_radius + map(noise(i,j,z), 0,1, ring_size, ring_size*2) * i;
      const radius_end = radius_start + ring_size;
      const start_x = radius_start * cos(theta);
      const start_y = radius_start * sin(theta);
      const end_x = radius_end * cos(theta);
      const end_y = radius_end * sin(theta);

      line(start_x, start_y, end_x, end_y);
    }
  }

  z += z_inc;
  pop();
  
  global_draw_end();
}
//***************************************************
//custom funcs
