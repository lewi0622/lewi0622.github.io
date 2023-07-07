'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 8


function gui_values(){
  parameterize("cols", 5, 1, 100, 1, false);
  parameterize("rows", 10, 1, 100, 1, false);
  parameterize("x_margin", 0, -100, 100, 1, true);
  parameterize("y_margin", 0, -100, 100, 1, true);
  parameterize("starting_square_size", 2*96, 1, 500, 1, true);
  parameterize("ending_square_size", 0.25*96, 0.1, 100, 1, true);
  parameterize("number_of_layers", 10, 1, 100,1, false);
  parameterize("rotation", 5, 0, 360, 1, false);
}

function setup() {
  common_setup(6*96, 8*96, SVG);
}
//***************************************************
function draw() {
  global_draw_start();
  push();

  let fill_c = color("WHITE");
  fill_c.setAlpha(256);
  fill(fill_c);
  rectMode(CENTER);

  translate(x_margin, y_margin);
  const col_step_size = (canvas_x-x_margin*2)/cols;
  const row_step_size = (canvas_y-y_margin*2)/rows;
  for(let z=0; z<number_of_layers; z++){
    const square_radius = lerp(starting_square_size, ending_square_size, z/number_of_layers);
    for(let i=0; i<cols; i++){
      for(let j=0; j<rows; j++){
        push();
        translate(i*col_step_size, j*row_step_size);
        translate(starting_square_size, starting_square_size);
        rotate(random(-rotation, rotation));
        square(0,0, square_radius);
        pop();
      }
    }
  }
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs