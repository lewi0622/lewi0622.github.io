'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [COTTONCANDY, SOUTHWEST, MUTEDEARTH]


function gui_values(){
  parameterize("step_size", 20, 1, 50, 1, true);
  parameterize("square_size", 30, 1, 60, 1, true);
}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();
  
  //apply background
  let bg_c = random(working_palette)
  background(bg_c)
  reduce_array(working_palette, bg_c)

  //actual drawing stuff
  push();
  center_rotate(random([0,90,180,270]));

  // const step=20*global_scale;
  // const square_size = 30*global_scale;
  const x_off = canvas_x/8 + square_size/2;
  const y_off = canvas_y/8 + square_size/2;

  let isFill=false;
  noFill();
  for(let i=0; i<14; i++){
    push();
    const c = random(working_palette);
    stroke(c);

    for(let j= 0; j<14; j++){
      if(random([0,1,2])==0){
        fill(c);
        isFill=true;
      }
      else{
        noFill();
        isFill=false;
      }

      const loop_noise = noise(i+j)*random([-1,1]);
      strokeWeight(random(1,5)*global_scale);

      push();
      translate(i*step_size+x_off, j*step_size+y_off);
      square(0, 0, loop_noise*square_size);
      if(isFill==true){
        stroke(bg_c);
        translate(loop_noise*square_size/4, loop_noise*square_size/4)
        square(0,0, loop_noise*square_size/2);
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