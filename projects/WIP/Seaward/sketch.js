'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

let weight;

function gui_values(){
  parameterize("overall_tilt", 22, 0, 180, 1, false);
  parameterize("wing_width_pct", 0.25, 0, 1, 0.01, false);
  parameterize("control_h_space", 0.75, 0, 10, 0.1, true);
  parameterize("min_wing_width", 11.25, 0, 100, 1, true);
  parameterize("max_wing_width", 77, 0, 500, 1, true);
  parameterize("max_wing_iteration", 10, 1, 100, 1, false);
} 

function setup() {
  common_setup();
  gui_values();

  noFill();
  weight = LEPEN * global_scale;
  strokeWeight(weight);
}
//***************************************************
function draw() {
  global_draw_start();
  push();

  for(let i=0; i<20; i++){
    push();
    translate(random(canvas_x), random(canvas_y));
    const w = random(min_wing_width, max_wing_width);
    bird(w, w/2);
    pop();
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs

function bird(w, h){
  rotate(random(-overall_tilt, overall_tilt)); //overall tilt
  
  const noise_val = random(100);

  wing(w/2 * random(1-wing_width_pct, 1+wing_width_pct), h, -1, noise_val);

  rotate(180);
  wing(w/2 * random(1-wing_width_pct, 1+wing_width_pct), h, 1, noise_val); 
}

function wing(w, h, dir, n){
  h*=dir;

  const control1 = {
    x: noise(n) * w/2,
    y: random(0.8, 1.2) * h * 2/3
  };
  const control2 = {
    x: map(noise(n+100), 0,1, w/2, w),
    y: random(0.8, 1.2) * h *2/3
  };
  const end_pt = {
    x: w,
    y: map(noise(n+200), 0,1, 0, h)
  };

  const iterations = map(w, min_wing_width/2, max_wing_width/2, 1, max_wing_iteration);

  for(let i=0; i<constrain(iterations, 1, max_wing_iteration); i++){
    bezier(
      0,0, 
      control1.x, control1.y + i * control_h_space * dir, 
      control2.x, control2.y + i * control_h_space * dir, 
      end_pt.x, end_pt.y
    );
  }
}