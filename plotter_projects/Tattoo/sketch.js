'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 30;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

function gui_values(){
  parameterize("cols", floor(base_x/4), 1, base_x, 1, false);
  parameterize("rows", floor(base_y/4), 1, base_y, 1, false);
}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();

  push();
  fill("BLACK");

  const col_step = canvas_x*1.5 / cols;
  const row_step = canvas_y*1.5 / rows;
  translate(-canvas_x/4, -canvas_y/4);
  for(let i=0; i<cols; i++){
    for(let j=0; j<rows; j++){
      push();
      const sin_offset = col_step * round(100 * sin(j*5));
      const noise_offset = col_step * round(800 * map(noise(j/500), 0,1, -1,1));
      translate(sin_offset + noise_offset + col_step * i, row_step * j);
      const noise_val = noise(i/100, j/100);
      if(noise_val > 0.6 || noise_val <0.4){
        rect(0,0,col_step,row_step);
      }
      pop();
    }
  }

  pop();
  
  global_draw_end();
}
//***************************************************
//custom funcs