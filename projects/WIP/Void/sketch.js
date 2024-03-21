'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 10;
const capture = false;
const capture_time = 10;

const suggested_palettes = [SAGEANDCITRUS, BEACHDAY, SOUTHWEST]

let bg_c;
let xoff = 0;
const inc = 0.01*60/fr;
let rot = 0;
let rot_inc = 1;

//TRY ADDING TWO COLOR VERSIONS, OR ONE COLOR THAT HAS HSB VARIATIONS ATTACHED
function gui_values(){

}

function setup() {
  common_setup();
  gui_values();
  bg_c = random(palette);
  rot_inc *= random([-1,1])
}
//***************************************************
function draw() {
  global_draw_start();

  //apply background
  refresh_working_palette();
  // const bg_c = random(working_palette);
  background(bg_c);
  reduce_array(working_palette, bg_c)
  //actual drawing stuff
  center_rotate(rot);
  push();
  let rad = map(noise(xoff), 0,1, 0.4,1.5)*canvas_x*0.9;
  let last_rad = rad;
  noStroke();

  translate(canvas_x/2, canvas_y/2);

  const steps = 100;
  for(let i=0; i<steps; i++){
    const c = random(working_palette);
    fill(c);
    const wobble = random(rad-last_rad, last_rad-rad);

    push();
    rotate(random(0,360));
    translate(wobble/2, 0);
    circle(0,0, rad);
    pop();

    last_rad = rad;
    rad*=(0.95-1/steps);
  }
  pop();

  push();
  const step=10*global_scale;
  bg_c[3]=40;
  noStroke();
  fill(bg_c);
  for(let i=0; i*step<canvas_x; i++){
    for(let j= 0; j*step<canvas_y; j++){
      const offset = j%2*(step/2);
      push();
      translate(i*step+offset, j*step);
      rotate(45);
      square(0, 0, 3*global_scale);
      pop();
    }
  }
  xoff+=inc;
  rot += rot_inc;
  pop();
  
  global_draw_end();
}
//***************************************************
//custom funcs



