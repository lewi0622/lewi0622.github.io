'use strict';

//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;


function gui_values(){
  parameterize("number_of_waves", 1, 1, 100, 1, false);
  parameterize("wave_steps", 500, 1, 10000, 50, false);
  parameterize("freq_mult", 1, 1, 100, 1, false);
  parameterize("x_wobble", 10, 0, 100, 1, true);
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
  const wave_step_size = canvas_x/wave_steps;
  for(let i=0; i<number_of_waves; i++){
    let shape_began = false;
    for(let j=0; j<wave_steps; j++){
      if(!shape_began){
        beginShape();
        shape_began = true;
      }
      const x=j*wave_step_size;
      const y=map(sin(x*freq_mult), -1,1, 0, canvas_y);
      vertex(x+map(noise(i + j), 0,1, -x_wobble, x_wobble),y);
      if(j%100==0){
        endShape();
        shape_began = false;
      }
    }
    endShape();
  }

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs