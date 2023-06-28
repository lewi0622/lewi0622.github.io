'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
suggested_palettes = [COTTONCANDY, SIXTIES, SUPPERWARE]


function gui_values(){
  parameterize("cols", 10, 1, 100, 1, false);
  parameterize("rows", 10, 1, 100, 1, false);
  parameterize("square_starting_size", 20, 1, 100, 1, true);
  parameterize("number_layers", 20, 1, 100, 1, false);
  parameterize("rotate_inc", 5, 0, 45, 1, false);
  parameterize("shrink_every_x_layer", 1, 1, 50, 1, false);
  parameterize("shrink_factor", 2, 0, 20, 0.1, true);
}

function setup() {
  common_setup(6*96, 2*96, SVG);
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();
  //actual drawing stuff
  push();
  // rectMode(CENTER);
  let square_size = square_starting_size;
  let rotate_value = 0;

  for(let z=0; z<number_layers; z++){
    push();
    if(z%shrink_every_x_layer==0) square_size -= shrink_factor;
    center_rotate(rotate_value);
    const starting_pt = [
      (canvas_x - square_size*cols)/2,
      (canvas_y - square_size*rows)/2
    ];
    translate(...starting_pt);
    for(let i=0; i<cols; i++){
      for(let j=0; j<rows; j++){
        push();
        translate(i*square_size, j*square_size);
        square(0,0, square_size);
        pop();
      }
    }
    rotate_value += rotate_inc;
    pop();
  }
  pop();

  global_draw_end();
}
//***************************************************
//custom funcs

