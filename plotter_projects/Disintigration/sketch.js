'use strict';

//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;


function gui_values(){
  parameterize("rotation", 0, 0, 360, 1, false);
  parameterize("number_of_swirls", 1, 1, 5, 1, false);
  parameterize("margin", 0.5*96, 0, 200, 1, true);
  parameterize("line_steps", 400, 1, 1000, 1, false);
  parameterize("i_noise_damp", 100, 1, 1000, 1, false);
  parameterize("j_noise_damp", 60, 1, 1000, 1, false);
  parameterize('z_noise_damp', 0.01, 0.01, 1000, 1, false);
  parameterize("noise_amp", 100, 1, 100, 1, true);
  parameterize("rotation_steps", 100, 1, 500, 1, false);
  parameterize("rotation_step_size", 1, -5, 5, 0.1, false);
}

function setup() {
  common_setup(8*96, 8*96);
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  center_rotate(rotation);
  const colors = gen_n_colors(number_of_swirls);
  for(let z=0; z<number_of_swirls; z++){
    push();
    stroke(colors[z]);
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