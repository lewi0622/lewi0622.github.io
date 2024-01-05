'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 10;

const suggested_palettes = [SAGEANDCITRUS, COTTONCANDY, SUPPERWARE]

let noise_factor = 0;
let noise_inc = 0.01;
let rotation = 0;
let rotation_inc = 1;

function gui_values(){
  parameterize("num_rows", 20, 1, 100, 1, false);
  parameterize("num_cols", 20, 1, 100, 1, false);
  parameterize("num_layers", 1, 1, 100, 1, false);
  parameterize("max_radius", 20, 1, 50, 1, true);
  parameterize("i_damp", 10, 1, 100, 1, false);
  parameterize("j_damp", 10, 1, 100, 1, false);
}

function setup() {
  common_setup();
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();

  //apply background
  background("BLACK")

  //actual drawing stuff
  push();
  center_rotate(rotation);
  fill("WHITE")
  stroke("BLACK")

  const row_step_size = width/num_cols;
  const col_step_size = height/num_rows;
  for(let z=0; z<num_layers; z++){
    for(let i=0; i<num_rows; i++){
      for(let j=0; j<num_cols; j++){
        push();
        translate(i*row_step_size, j*col_step_size);
        let radius = map(noise(i/i_damp,j/j_damp, noise_factor), 0,1, 3, max_radius)*global_scale;
        circle(0,0,radius);
        pop();
      }
    }
  }

  noise_factor += noise_inc;
  rotation += rotation_inc;
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs




