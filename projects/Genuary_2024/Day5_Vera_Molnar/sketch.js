'use strict';
//setup variables
let gif = true;
let animation = true;
const fr = 10;
const capture = false;
const capture_time = 20;

const suggested_palettes = [BIRDSOFPARADISE, NURSERY];

let rows, cols, iterations, post_count;

function gui_values(){
  parameterize("i_damp", 2, 1, 100, 1, false);
  parameterize("j_damp", 2, 1, 100, 1, false);
  parameterize("rot_amt", 10, 0, 10, 0.1, false);
}

function setup() {
  common_setup();
  gui_values();
  rows = 1;
  cols = 1;
  iterations = 1;
  post_count = 0;
  working_palette = controlled_shuffle(working_palette, true);
  loop();
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();

  background("WHITE");

  const row_step = canvas_y/rows;
  const col_step = canvas_x/cols;

  rectMode(CENTER);
  noStroke();

  translate(col_step/2, row_step/2);

  for(let i=0; i<rows; i++){
    for(let j=0; j<cols; j++){
      push();
      translate(i*row_step, j*col_step);

      for(let z=0; z<iterations; z++){
        push();
        if(z%2 == 1)blendMode(MULTIPLY);
        const c_id = floor(noise(i/i_damp, j/j_damp, z*100) * working_palette.length);
        rotate(random(-rot_amt,rot_amt));
        fill(working_palette[c_id]);
        const end_x = lerp(col_step, 0, z/iterations);
        const end_y = lerp(row_step, 0, z/iterations);       
        rect(0,0, end_x, end_y);

        pop();
      }
      pop();
    }
  }

  if(frameCount % 3 == 0){
    if(rows < 10){
      rows++;
      cols++;
    }
    else if(iterations < 5) iterations++;
    else if(post_count<5) post_count++;
    else noLoop();
  }


  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
