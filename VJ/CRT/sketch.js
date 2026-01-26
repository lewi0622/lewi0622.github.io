'use strict';

//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = true;
const capture_time = 10;

const suggested_palettes = [];

let z;
let z_inc = 1;
let ang;

function gui_values(){
  parameterize("iterations", 10, 1, 50, 1, false);
  // parameterize("rot_per_iteration", random(-0.5, 0.6), -180, 180, 0.1, false);
  parameterize("wobble", random(100), 0, 100, 0.1, true);
  parameterize("margin_x", -base_x, -base_x/2, base_x/2, 1, true);
  parameterize("margin_y", -base_y, -base_y/2, base_y/2, 1, true);
}

function setup() {
  common_setup();
  gui_values();
  z = random(360);
  ang = random(360);
  stroke("WHITE");
  document.body.style.background = "BLACK";
  pixelDensity(2);
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  
  const num_lines = floor(map(sin(angle_loop(fr, capture_time, 1)), -1,1, 200, 300));
  // if(frameCount%30 == 0) ang = random(360);
  const rot_per_iteration = sin(angle_loop(fr, capture_time, 1)) * ang;
  strokeWeight(0.5*global_scale);
  for(let j=0; j<iterations; j++){
    push();
    center_rotate(j*rot_per_iteration);
    translate(random(wobble), random(wobble));
    for(let i=0; i<num_lines; i++){
      const x = lerp(margin_x, canvas_x-margin_x, i/num_lines);
      line(x, margin_y, x, canvas_y-margin_y);
    }
    pop();
  }
  z += z_inc;
  pop();

  global_draw_end();
}
//***************************************************
//custom funcs