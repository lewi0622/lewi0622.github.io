'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [BIRDSOFPARADISE];

function gui_values(){
  parameterize("num_leaves", 10, 1, 50, 1, false);
} 

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();
  push();
  noFill();
  const weight = 2;
  png_bg(true);
  strokeWeight(weight);
  for(let i=0; i<num_leaves; i++){
    stroke(random(working_palette));
    const x_start = random(width);
    const y_start = random(height);
    const x_end = random(width);
    const y_end = random(height);
    thick_bezier(x_start, y_start, x_end, y_end, 30, weight, i); 
  }
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs

function thick_bezier(x1, y1, x4, y4, num_steps, w, n_dim) {
  const y_noise_offset = random(500);
  const start_x2 = random(x1, x4);
  const start_y2 = random(y1, y4);
  let x2 = start_x2 + w * num_steps;
  let y2 = start_y2 - w * num_steps;
  let x3, y3;

  for (let i = 0; i < num_steps; i++) {
    x3 = map(noise(n_dim, i / 100), 0, 1, 0.5, 1.5) * x2;
    y3 = map(noise(n_dim, (i + 100) / 100), 0, 1, 0.5, 1.5) * y2;
    if(random()<0.9) bezier(x1, y1, x2, y2, x3, y3, x4, y4);
    x2 -= w;
    y2 += w;
  }
}