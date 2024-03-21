'use strict';

//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [SAGEANDCITRUS, BIRDSOFPARADISE];

function gui_values(){
  parameterize("number_of_swirls", ceil(random(1,3)), 1, 5, 1, false);
  parameterize("margin", random(50), 0, 200, 1, true);
  parameterize("line_steps", floor(random(100, 600)), 1, 1000, 1, false);
  parameterize("i_noise_damp", random(25, 300), 1, 1000, 1, false);
  parameterize("j_noise_damp", random(10, 300), 1, 1000, 1, false);
  parameterize('z_noise_damp', 0.01, 0.01, 1000, 1, false);
  parameterize("noise_amp", random(10,250), 1, 500, 1, true);
  parameterize("rotation_steps", random(30, 300), 1, 500, 1, false);
  parameterize("rotation_step_size", random(0.5, 1.5), 0, 5, 0.1, false);
  parameterize("weight", random(0.3, 1.1), 0.1, 20, 0.1, true);
  parameterize("blur_on", 1, 0, 1, 1, false);
}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  strokeWeight(weight);
  let bg_c = random(working_palette);
  background(bg_c);
  reduce_array(working_palette, bg_c);
  for(let z=0; z<number_of_swirls; z++){
    push();
    const c = random(working_palette);
    if(blur_on){
      drawingContext.shadowBlur=weight*2;
      drawingContext.shadowColor = color(c);
    }
    stroke(c);
    const rotation_direction = random([-1,1]);
    const offset_x = random(-canvas_x/16, canvas_x/16);
    const offset_y = random(-canvas_y/16, canvas_y/16);
    translate(canvas_x/2+offset_x, canvas_y/2+offset_y);
    rotate(random(360));
    const line_step_size = (canvas_x-margin*2)/line_steps;

    const skips = new Array(line_steps).fill(0); //
    for(let j=0; j<rotation_steps; j++){
      push();
      rotate(j*rotation_step_size*rotation_direction);
      translate(-canvas_x/2+margin, 0);
      const line_chance = map(j, 0, rotation_steps, 1, 0.9);
      for(let i=1; i<=line_steps; i++){
        if(random()>line_chance) skips[i] = 1;
        if(skips[i] == 1) continue;
        line(i*line_step_size, map(noise(i/i_noise_damp, j/j_noise_damp, z/z_noise_damp), 0,1, -noise_amp, noise_amp),
        (i+1)*line_step_size, map(noise((i+1)/i_noise_damp, j/j_noise_damp, z/z_noise_damp), 0,1, -noise_amp, noise_amp))
      }
      pop();
    }
    pop();
  }
  pop();

  global_draw_end();
}
//***************************************************
//custom funcs