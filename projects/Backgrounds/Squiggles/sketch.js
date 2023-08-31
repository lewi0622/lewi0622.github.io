'use strict';

//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

suggested_palettes = [SAGEANDCITRUS, COTTONCANDY, BUMBLEBEE, BIRDSOFPARADISE, SOUTHWEST, NURSERY];

function gui_values(){
  parameterize("num_lines", 500, 1, 500, 1, false);
  parameterize("line_steps", 10, 1, 5000, 1, false);
  parameterize("line_step_size", 0.2, 0.01, 10, 0.01, false); //step size along noise curve
  parameterize("amp", random(5,15), 1, 100, 1, true);
}

function setup() {
  common_setup();
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  center_rotate(random(360));
  let bg_c = random(working_palette);
  reduce_array(working_palette, bg_c);
  background(bg_c);

  strokeWeight(1*global_scale);

  noFill();
  for(let i=0; i<num_lines; i++){
    let c = color(random(working_palette));
    c.setAlpha(180);
    stroke(c);
    let start_x = random(canvas_x*1.25);
    let start_y = random(canvas_y*1.25);
    const noise_x_offset = random(500);
    const noise_y_offset = random(500);
    beginShape();
    for(let j=0; j<line_steps; j++){
      const x = map(noise(start_x + noise_x_offset, i, j*line_step_size), 0,1, -amp, amp);
      const y = map(noise(start_y + noise_y_offset, i, j*line_step_size), 0,1, -amp, amp)
      start_x += x;
      start_y += y;
      curveVertex(start_x, start_y);

      if(j/line_steps>0.5 && (start_x>canvas_x || start_x<0 || start_y>canvas_y || start_y<0)) break;
    }
    endShape();
  }

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs