'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 5;
const capture = false;
const capture_time = 50/fr;

const suggested_palettes = [];
function gui_values(){
  parameterize("min_radius", 50, -400, 400, 1, true);
  parameterize("i_damp", 100, 1, 500, 1, false);
  parameterize("j_damp", 1, 1, 500, 1, false);
}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************


function draw() {
  global_draw_start();
  push();

  const c = color(BIC_PINK);
  c.setAlpha(BICCRISTAL_ALPHA);
  stroke(c);
  strokeWeight(BICCRISTAL);
  
  translate(canvas_x/2, canvas_y/2);

  wave(random(360), random(40, 180), random(50, 150), 2, 0);

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
function wave(starting_angle, angle_size, num_steps, iterations = 1, offset = 0){

  const max_radius = min(canvas_x, canvas_y)/2;
  const angle_step = angle_size / num_steps;

  for(let j=0; j<iterations; j++){
    for(let i=0; i<num_steps; i++){
      const theta = j * offset + starting_angle + i * angle_step;
      const rad = map(noise(i/i_damp, j/j_damp), 0,1, min_radius, max_radius);

      const starting_pt = {
        x: min_radius * cos(theta),
        y: min_radius * sin(theta)
      };
      const ending_pt = {
        x: rad * cos(theta),
        y: rad * sin(theta)
      };

      line(starting_pt.x, starting_pt.y, ending_pt.x, ending_pt.y);
    }
  }
}