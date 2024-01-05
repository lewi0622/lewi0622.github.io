'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [COTTONCANDY, SIXTIES, SUPPERWARE]


function gui_values(){
  parameterize("rows", 20, 1, 100, 1, false);
  parameterize("cols", 10, 1, 100, 1, false);
  parameterize("layers", 2, 1, 3, 1, false);
  parameterize("min_circle_rad", (1/8)*96, 0, 300, 1, true);
  parameterize("max_circle_rad", 1*96, 0, 300, 1, true);
  parameterize("x_wobble", 0.5*96, 0, 300, 1, true);
  parameterize("y_wobble", 0.5*96, 0, 300, 1, true);
  parameterize("i_damp", 10, 1, 100, 1, false);
  parameterize("j_damp", 10, 1, 100, 1, false);
}

function setup() {
  common_setup(6*96, 8*96, SVG);
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  noFill();
  let c = 0;
  const x_step = canvas_x/cols;
  const y_step = canvas_y/rows;
  for(let z=0; z<layers; z++){
    const i_noise_offset = random(-100, 100);
    const j_noise_offset = random(-100, 100);
    stroke(c);
    for(let i=0; i<cols; i++){
      for(let j=0; j<rows; j++){
        push();
        translate(i*x_step, j*y_step);
        const x = map(noise(i/i_damp, j/j_damp, z), 0,1, -x_wobble, x_wobble);
        const y = map(noise(i/i_damp, j/j_damp, z), 0,1, -y_wobble, y_wobble);
        const rad = random(min_circle_rad, max_circle_rad);
        circle(x,y,rad);
        pop();
      }
    }
    c+=5;
  }
  pop();

  global_draw_end();
}
//***************************************************
//custom funcs

