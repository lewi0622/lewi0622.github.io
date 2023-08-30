'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 8


function gui_values(){
  parameterize("cols", 20, 1, 100, 1, false);
  parameterize("col_steps", 50, 1, 100, 1, false);
  parameterize("deflection_angle", 5, 0, 180, 0.5, false);
  parameterize("amp", 1, 0, 20, 0.1, true);
  parameterize("i_damp", 1, 0.1, 10, 0.1, false);
  parameterize("j_damp", 1, 0.1, 10, 0.1, false);
}

function setup() {
  common_setup(4*96, 6*96, SVG);
}
//***************************************************
function draw() {
  global_draw_start();
  push();
  const x_step_size = canvas_x/cols;
  const y_step_size = canvas_y/col_steps;
  translate(x_step_size/2, 0); 

  let c1 = color("RED");
  let c2 = color("BLUE");
  c1.setAlpha(150);
  c2.setAlpha(150);

  for(let z=0; z<2; z++){
    if(z==0) stroke(c1);
    else stroke(c2);
    let ang = random(-deflection_angle, deflection_angle);
    for(let i=0; i<cols; i++){
      for(let j=0; j<col_steps; j++){
        push();
        translate(i*x_step_size, j*y_step_size);
        rotate(ang);
        const x = map(noise(i/i_damp + j/j_damp), 0,1, -amp, amp);
        line(x, 0, x, y_step_size);
        pop();
      }
    }
  }


  pop();
  global_draw_end();
}
//***************************************************
//custom funcs