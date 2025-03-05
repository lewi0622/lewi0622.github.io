'use strict';
//setup variables
let gif = true;
let animation = true;
const fr = 30;
const capture = false;
const capture_time = 20;

const suggested_palettes = [];

let z = 0;
const z_inc = 0.01;

function gui_values(){
  parameterize("num_lines", 100, 1, 1000, 1, false);
  parameterize("x_amp", 10, 0, 100, 1, true);
  parameterize("y_amp", 10, 1, 100, 1, true);
  parameterize("i_damp", 100, 1, 1000, 1, false);
  parameterize("j_damp", 100, 1, 1000, 1, false);
  parameterize("z_coarse", 0, 0, 100, 10, false);
  parameterize("z_fine", 0, 0, 10, 0.2, false);
}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();

  if(type == "svg") z = z_coarse + z_fine;

  push();
  background("WHITE");
  noFill();
  strokeWeight(PILOTPRECISEV5*global_scale);
  const line_step_size = canvas_x/num_lines;
  translate(line_step_size/2, 0);

  let offset = 0;

  for(let i=0; i<num_lines; i++){
    push();
    // if(i%20==0) offset += 20;
    translate(i * line_step_size, 0);
    let x = 0;
    let y = 0;
    let counter = 0;
    beginShape();
    while(y<canvas_y){
      if(counter % 2 ==0){
        x += map(pnoise.simplex3(i/i_damp + offset, counter/j_damp + offset, z), -1,1, -x_amp, x_amp);
      }
      else{
        y += map(pnoise.simplex3(i/i_damp, counter/j_damp, z), -1,1, 0, y_amp);
      }
      vertex(x,y);
      counter++;
    }
    endShape();

    pop();
  }

  z += z_inc;
 
  pop();
  
  global_draw_end();
}
//***************************************************
//custom funcs
