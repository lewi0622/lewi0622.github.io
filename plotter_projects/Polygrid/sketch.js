'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

function gui_values(){
  parameterize("cols", round(base_x/10), 1, 200, 1, false);
  parameterize("rows", round(base_y/10), 1, 500, 1, false);
  parameterize("i_damp", 100, 1, 1000, 1, false);
  parameterize("j_damp", 10, 1, 1000, 1, false);
  parameterize("layers", 4, 1, 10, 1, false);
  parameterize("step_layer", 1, 0.01, 10, 0.01, false);
} 

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();
  push();
  // png_bg(true);

  const col_step = canvas_x/cols;
  const row_step = canvas_y/rows;

  strokeWeight(MICRON005*global_scale);

  for(let i=0; i<working_palette.length; i++){
    const c = color(working_palette[i]);
    c.setAlpha(150);
    working_palette[i] = c;
  }


  noFill();
  for(let z=0; z<layers; z++){
    stroke(working_palette[z%working_palette.length]);
    for(let i=0; i<cols; i++){
      for(let j=0; j<rows; j++){
        push();
        translate(i*col_step, j*row_step);
        const radius = map(noise(i/i_damp, j/j_damp, z*step_layer), 0,1, 0, 10*global_scale);
        const num_sides = round(map(noise(i/i_damp, j/j_damp, z*step_layer), 0,1, 3, 9));
        polygon(0,0,radius,num_sides);
        pop();
      }
    }
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs