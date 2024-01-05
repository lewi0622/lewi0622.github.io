'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [SAGEANDCITRUS, SUPPERWARE];

function gui_values(){
  parameterize("start_y", 0, -400, 400, 1, true);
  parameterize("step_number", 200, 10, 1000, 1, false);
  parameterize("y_slide", 1.2, 0, 5, 0.1, true);
  parameterize("noise_damp_y", random(100,500), 1, 500, 10, false);
  parameterize("noise_damp_drift", 250, 1, 500, 1, false);
  parameterize("shape_number", 500, 1, 1000, 1, false);
}

function setup() {
  common_setup(8*96, 6*96);
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();

  //actual drawing stuff
  push();
  const colors = [color("YELLOW"), color("MAGENTA"), color("CYAN"), color("BLACK")];
  colors.forEach((c,idx) => {
    colors[idx].setAlpha(120);
  });

  noFill();
  strokeWeight(1);
  const step_size = canvas_x*2/step_number;

  //find a minimum value to try and center on screen
  let max_noise = 0;
  let max_noise_x_index = 0;
  for(let i=0; i<100; i++){
    for(let j=0; j<100; j++){
      if(noise(i,j)>max_noise){
        max_noise=noise(i,j);
        max_noise_x_index = i;
      }
    }
  }

  translate(0, start_y);

  const noise_range = random(0.25,3) * canvas_x/(400*global_scale);
  for(let j=0; j<shape_number; j++){
    if(j%10 == 0)stroke(random(colors));
    push(); 
    let drift_offset = map(noise(j/noise_damp_drift), 0,1, -noise_range,noise_range);
    //drift less over time
    if(j/shape_number>0.5) drift_offset = map(j/shape_number, 0.5,1, drift_offset,0);
    const noise_range_min = max_noise_x_index + drift_offset - noise_range/2;
    const noise_range_max = max_noise_x_index + drift_offset + noise_range/2;
   
    let prev_x, prev_y;
    for(let i=0; i<step_number; i++){
      let y_min = map(j, 0, shape_number, 0, -canvas_y) + j*y_slide;
      let y_max = canvas_y + j*y_slide;
      const noise_index = map(i, 0,step_number, noise_range_min, noise_range_max);
      const current_x = map(i, 0,step_number, -step_size, canvas_x+step_size);
      const current_y = map(noise(noise_index,j/noise_damp_y), 0,1, y_min, y_max);
      if(i != 0) line(prev_x, prev_y, current_x, current_y);
      prev_x = current_x;
      prev_y = current_y;
    }

    pop();
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs




