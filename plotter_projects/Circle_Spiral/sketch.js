'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 8

const suggested_palettes = [COTTONCANDY, BIRDSOFPARADISE, SIXTIES, TOYBLOCKS];

function gui_values(){
  parameterize("num_circles", floor(random(10,50)), 1, 100, 1, false);
  parameterize("nth_filled_circle", random([1,2,3,4,5]), 0, 100, 1, false);
  parameterize("rot_per_circle", random(-60,60), -60, 60, 1, false);
  parameterize("size_inc_per_circle", random(2,8), 0, 20, 0.1, true);
  parameterize("spiral_step_per_circle", random(2,10), 0, 20, 0.1, true);
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
  const bg_c = random(working_palette);
  reduce_array(working_palette, bg_c);
  if(type=="png") background(bg_c);

  let c1 = random(working_palette);
  reduce_array(working_palette, c1);
  let c2 = random(working_palette);

  strokeWeight(1*global_scale);

  noFill();

  translate(canvas_x/2, canvas_y/2);
  stroke(c1);
  drawingContext.shadowBlur=2*global_scale;
  drawingContext.shadowColor = color(c1);
  for(let i=0; i<num_circles; i++){
    rotate(rot_per_circle);
    push();
    if(i%nth_filled_circle==0) fill(c2);
    circle(0, i * spiral_step_per_circle, (i+1) * size_inc_per_circle);
    pop();
  } 
  
  pop();

  global_draw_end();
}
//***************************************************
//custom funcs


