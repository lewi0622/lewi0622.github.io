'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];


function gui_values(){
  parameterize("cols", floor(base_x/random(2,6)), 10, base_x*3/4, 1, false);
  parameterize("rows", floor(base_y/random(2,6)), 10, base_y*3/4, 1, false);
  parameterize("sin_mult", random(-10,10), -20, 20, 0.1, false);
  parameterize("cos_mult", random(-20,20), -50, 50, 0.1, false);
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
  const weight = LEPEN*global_scale;
  strokeWeight(weight);
  const col_step = width / cols;
  const row_step = height / rows;

  translate(col_step / 2, row_step / 2);

  let sin_counter = 0;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      push();
      translate(i * col_step, j * row_step);
      sin_counter += random(-sin_mult / 2, sin_mult);
      const noise_val = map(
        noise(i / 100, j / 100) * 4 + sin(sin_counter) + cos(j * cos_mult),
        -2, 6,
        0, 1
      );
      if ((i + j) % 2 == 0) rotate(map(noise_val, 0, 1, -180, 0));
      else rotate(map(noise_val, 0, 1, 0, 180));
      let num_lines = floor(noise_val * 10);
      const line_step = row_step / num_lines;
      for (let k = 0; k < num_lines; k++) {
        push();
        translate(0, k * line_step);
        line(0, 0, col_step, 0);
        pop();
      }
      pop();
    }
  }

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs

