'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 30;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

function gui_values(){
  parameterize("cols", floor(base_x), 1, base_x*2, 1, false);
  parameterize("rows", floor(base_y), 1, base_y*2, 1, false);
  parameterize("x_sin_freq_mult", random(0.5, 5), 0, 10, 0.1, false);
  parameterize("x_sin_mult", smaller_base/random(3,8), 1, smaller_base, 0.1, false);
}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();

  push();
  if(type=="png") background("WHITE");
  const c = color("BLACK");
  // c.setAlpha(100);
  stroke(c);
  fill(c);

  const col_step = canvas_x*7/8 / cols;
  const row_step = canvas_y / rows;
  translate(canvas_x/16, 0);
  for(let i=0; i<cols; i++){
    for(let j=0; j<rows; j++){
      push();
      const x_sin_offset = col_step * round(x_sin_mult * sin(j*x_sin_freq_mult));
      const noise_offset = col_step * round(800 * map(noise(j/200), 0,1, -1,1));
      translate(
        x_sin_offset + noise_offset + col_step * i, 
        row_step * j);
      const noise_val = noise(i/100, j/100);
      if(noise_val>0.6 || noise_val<0.4){
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