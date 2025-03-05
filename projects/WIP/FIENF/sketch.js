'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

function gui_values(){
  parameterize("cols", 10, 1, 100, 1, false);
  parameterize("lines_per_tile", 10, 1, 100, 1, false);
  parameterize("x_damp", 10, 1, 100, 0.1, false);
  parameterize("y_damp", 10, 1, 10000, 0.1, false);
} 

function setup() {
  common_setup();
  strokeCap(SQUARE);
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();
  //actual drawing stuff
  push();
  const weight = PITTPEN*global_scale;
  strokeWeight(weight);
  const step_size = canvas_x/cols;
  const line_step_size = step_size/lines_per_tile;
  const rows = round(canvas_y/step_size);
  for(let i=0; i<cols; i++){
    for(let j=0; j<rows; j++){
      push();
      translate(i * step_size, j * step_size);
      if(noise(i/x_damp, j/y_damp)>0.5){
        translate(step_size/2, step_size/2);
        rotate(90);
        translate(-step_size/2, -step_size/2);
      }
      translate(0, line_step_size/2);
      for(let z=0; z<lines_per_tile; z++){
        push();
        translate(0, z * step_size/lines_per_tile);
        line(0,0,step_size,0);
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
