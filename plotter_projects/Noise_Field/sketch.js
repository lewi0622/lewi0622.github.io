'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 8;


function gui_values(){
  parameterize("rows", floor(random(50,250)), 1, 1000, 1, false);
  parameterize("cols", floor(random(8,20)), 1, 100, 1, false);
  parameterize("amp", random(50,200), 1, 1000, 1, true);
  parameterize("i_damp", 150, 1, 1000, 1, false);
  parameterize("j_damp", 1, 1, 1000, 1, false);
  parameterize("z_mult", 100, 0.1, 1000, 0.1, false);
}

function setup() {
  common_setup(8*96, 6*96, SVG);
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  noFill();
  const row_step_size = canvas_y/rows;
  const col_step_size = canvas_x/cols;

  let c1 = color("RED");
  let c2 = color("BLUE");
  c1.setAlpha(100);
  c2.setAlpha(100);
  stroke(c1);
  for(let z=0; z<2; z++){
    if(z==1) stroke(c2);

    for(let i=0; i<rows; i++){
      push();
      translate(0, row_step_size*i);
      beginShape();
      for(let j=0; j<cols; j++){
        const x = j*col_step_size;
        const y = map(noise(i/i_damp,j/j_damp, z*z_mult), 0,1, -amp, amp);
        vertex(x, y);
      }
      endShape();
      pop();
    }
  }
  pop();

  global_draw_end();
}
//***************************************************
//custom funcs


