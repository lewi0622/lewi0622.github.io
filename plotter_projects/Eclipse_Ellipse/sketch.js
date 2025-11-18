'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];


function gui_values(){
  parameterize("cols", 100, 1, 1000, 1, false);
  parameterize("rows", floor(random(3,10)), 1, 20, 1, false);
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

  noFill();
  strokeWeight(LEPEN * global_scale);
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
        if(i+1==cols){
          stroke("WHITE");
          fill("WHITE");
        }
        ellipse(0, 0, lerp(0, row_step, i/cols), row_step);
        pop();
    }
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

