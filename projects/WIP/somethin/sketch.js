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
  parameterize("rows", 10, 1, 100, 1, false);

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
  strokeWeight(LEPEN*global_scale);
  const margin_x = canvas_x;
  const margin_y = canvas_y;

  const col_step = (canvas_x + margin_x) / cols;
  const row_step = (canvas_y + margin_y) / rows

  translate(-margin_x/2, -margin_y/2);

  const col_offset = [];
  for(let i=0; i<cols; i++){
    const noise_val = cols/4 * map(noise(i/10), 0,1, -1,1);
    col_offset.push(round(noise_val));
  }
  const row_offset = [];
  for(let i=0; i<rows; i++){
    const noise_val = rows/4 * map(noise(i/10), 0,1, -1,1);
    row_offset.push(round(noise_val));
  }

  for(let i=0; i<cols; i++){
    push();
    translate(0, row_step * col_offset[i]);
    for(let j=0; j<rows; j++){
      push();
      translate(col_step * row_offset[j], 0);
      translate(i * col_step, j * row_step);
      const ang = 360 * noise(i/1000, j/1000);
      grid_lines(col_step, row_step, ang);
      // const noise_val = 256*noise(i/10,j/10);
      // fill(noise_val);
      // rect(0,0, col_step, row_step);
      pop();
    }
    pop();
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs

function grid_lines(col_step, row_step, ang){
  ang = round(ang/15)*15;
  const num_lines = 10;
  const x_step = col_step/num_lines;
  const y_step = row_step/num_lines;
  for(let i=0; i<num_lines; i++){
    for(let j=0; j<num_lines; j++){
      if(random() > 0.9) continue;
      push();
      translate(i * x_step, j *y_step);
      rotate(ang);
      line(0,0, col_step, 0);
      pop();
    }
  }
}