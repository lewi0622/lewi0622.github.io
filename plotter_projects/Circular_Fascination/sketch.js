'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

function gui_values(){
  parameterize("cols", smaller_base/4, 1, smaller_base/2, 1, false);
} 

function setup() {
  common_setup();
  gui_values();
}
//Process it first, then occult, I'm not sure why it doesn't work the other way around

//***************************************************
function draw() {
  global_draw_start();
  push();
  noFill();
  strokeWeight(LEPEN * global_scale);
  const rows = floor(random(3, 10));
  const highlighted_row = floor(random(rows));
  const row_step = height/rows;
  let col_step = (width - row_step)/cols;
  translate(row_step/2, row_step/2); //offset
  for(let j=0; j<rows; j++){
    push();
    if(j%2 == 0) translate(col_step * cols, 0);
    col_step *= -1;
    translate(0, j* row_step);
    let last_x;
    for(let i=0; i<cols;i++){
        push();
        last_x = i * col_step;
        translate(last_x, 0);
        ellipse(0, 0, lerp(0, row_step, (i+1)/cols), row_step);
        pop();
    }
    stroke("WHITE");
    fill("WHITE");
    circle(last_x, 0, row_step);
    if(j == highlighted_row) {
      stroke("ORANGE");
      fill("ORANGE");
      circle(last_x, 0, row_step * 0.9);
    }
    pop();
  }
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
