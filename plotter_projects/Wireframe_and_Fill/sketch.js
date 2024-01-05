'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = []


function gui_values(){
  parameterize("col_shapes", 20, 1, 100, 1, false);
  parameterize("row_shapes", 10, 1, 100, 1, false);
  parameterize("x_margin", 10, 0, 100, 1, true);
  parameterize("y_margin", 10, 0, 100, 1, true);
  parameterize("y_min_size", 10, 1, 100, 1, true);
  parameterize("x_min_size", 10, 1, 100, 1, true);
  parameterize("y_max_size", 20, 1, 100, 1, true);
  parameterize("x_max_size", 50, 1, 100, 1, true);
}

function setup() {
  common_setup(6*96, 8*96, SVG);
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();
  //actual drawing stuff
  push();
  noFill();

  translate(x_margin, y_margin);

  const col_step_size = (canvas_y-y_margin*2)/col_shapes;
  const row_step_size = (canvas_x-x_margin*2)/row_shapes;
  for(let i=0; i<col_shapes-1; i++){
    push();
    translate(random(x_min_size, x_max_size)/2, random(y_min_size, y_max_size));
    for(let j=0; j<row_shapes-1; j++){
      push();
      translate(j*row_step_size, i*col_step_size);
      rect(0,0, random(x_min_size, x_max_size), random(y_min_size, y_max_size));
      pop();
    }
    pop();
  }

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs

