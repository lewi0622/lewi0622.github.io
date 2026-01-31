'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 1;

const suggested_palettes = [];

function gui_values(){
  parameterize("rows", round(random(10, 50)), 1, 100, 1, false);
  parameterize("cols", round(random(10, 50)), 1, 100, 1, false);
  parameterize("loops_per_cap", capture_time, 1, 50, 1, false);
  parameterize("row_mult", floor(random(1,100)), 1, 200, 1, false);
  parameterize("col_mult", floor(random(1,100)), 1, 200, 1, false);
} 

function setup() {
  common_setup();
  gui_values();

  noStroke();
  fill("WHITE");

  document.body.style.background = "BLACK";
  pixelDensity(2);
}
//***************************************************
function draw() {
  global_draw_start();

  const nominal_row_size = canvas_y/rows;
  const nominal_col_size = canvas_x/cols;
  
  let x_start = 0;
  let loop_count = 0;

  const z = angle_loop(fr, capture_time, loops_per_cap);
  
  let i =0;
  while(x_start < canvas_x){
    let y_start = 0;
    let col_size = nominal_col_size * map(sin(z+(i+1)*col_mult), -1,1, 0.5, 1.5);
    if(col_size + x_start > canvas_x) col_size = canvas_x - x_start;
    let j=0;
    while(y_start <canvas_y){
      let row_size = nominal_row_size * map(cos(z+(j+1)*row_mult), -1,1, 0.5, 1.5);
      if(row_size + y_start > canvas_y) row_size = canvas_y - y_start;
      push();
      translate(x_start, y_start);
      if((i%2 + j%2) ==1)rect(0,0, col_size, row_size, col_size);
      pop();
      y_start += row_size;
      loop_count++;
      j++
    }
    x_start += col_size;
    i++
  }
  global_draw_end();
}
//***************************************************
//custom funcs
