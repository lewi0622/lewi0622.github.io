'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 30;
const capture = false;
const capture_time = 10;

const suggested_palettes = []

function gui_values(){
  parameterize("num_rows", 100, 1, 400, 1, false);
  parameterize("num_cols", 100, 1, 400, 1, false);
  parameterize("amp_noise", 10, 0, 100, 1, true);
}

function setup() {
  common_setup();
}
//***************************************************
function draw() {
  global_draw_start(false);

  refresh_working_palette();

  //apply background
  let bg_c = random(working_palette);
  reduce_array(working_palette, bg_c);

  background(bg_c);
  noStroke();

  //actual drawing stuff
  push();
  const row_step = canvas_y/num_rows;
  const col_step = canvas_x/num_cols;
  for(let i=0; i<num_rows; i++){
    for(let j=0; j<num_cols; j++){
      push();
      let x = j*col_step;
      let y = i*row_step;
      x += amp_noise * pnoise.simplex2(x/100,y/100);
      y += amp_noise * pnoise.simplex2(x/100,y/100);
      rect(floor(x),floor(y),ceil(col_step), ceil(row_step));
      pop();
    }
  }

  pop();
  
  global_draw_end();
}
//***************************************************
//custom funcs