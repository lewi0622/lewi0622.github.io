'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];


function gui_values(){
  parameterize("cols", 20, 1, 100, 1, false);
  parameterize("num_states", 5, 1, 100, 1, false);
  parameterize("col_damp", 10, 1, 100, 1, false);
  parameterize("row_damp", 10, 1, 100, 1, false);
  parameterize("num_steps", 400, 1, 800, 1, false);
  parameterize("num_lines", 100, 1, 1000, 1, false);
}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();
  push();

  const grid_size = canvas_x/cols;
  const rows = round(canvas_y/grid_size);
  // noStroke();

  const matrix = [];
  for(let i=0; i<cols; i++){
    const row = [];
    for(let j=0; j<rows; j++){
      // push();
      const noise_val = map(noise(i/col_damp, j/row_damp), 0,1, 0, num_states);
      row.push(floor(noise_val));
      // translate(i*grid_size, j*grid_size);
      // fill(working_palette[row[j]%working_palette.length]);
      // square(0,0, grid_size);
      // pop();
    }
    matrix.push(row);
  }

  const weights = [];
  for(let i=0; i<num_states; i++){
    weights.push(random(1,30));
  }

  const x_step_size = canvas_x/num_steps;
  const y_step_size = canvas_y/num_lines;

  for(let j=0; j<num_lines; j++){
    let prev_pt = {x: 0, y: j*y_step_size};
    for(let i=0; i<num_steps; i++){
      const new_pt = {x: i*x_step_size, y:j*y_step_size + map(noise(i/100), 0,1, -canvas_y/2, canvas_y/2)};
      const x_grid = floor(new_pt.x/grid_size);
      const y_grid = floor(new_pt.y/grid_size);
      if(x_grid<0 || y_grid <0){
        prev_pt = new_pt;
        continue;
      }
      const index = matrix[floor(new_pt.x/grid_size)][floor(new_pt.y/grid_size)]%working_palette.length;
      console.log(index);
      stroke(working_palette[index]);
      line(prev_pt.x, prev_pt.y, new_pt.x, new_pt.y);
      prev_pt = new_pt;
    }
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs