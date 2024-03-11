'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];


function gui_values(){
  parameterize("num_loops", 25, 1, 500, 1, false);
  parameterize("loop_inc", 3, 0, 50, 1, true);
  parameterize("num_segments", 300, 1, 400, 1, false);
  parameterize("wobble", 10, 0, 100, 1, true);
}

function setup() {
  common_setup();
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();

  //apply background
  push();
  if(type != "svg") background("WHITE");
  noFill();

  const ang_step = 270/num_segments;
  const pt1 = {
    x: canvas_x/4 + random(-1,1) * wobble, 
    y: canvas_y/4 + random(-1,1) * wobble
  };
  const pt2 = {
    x: canvas_x*3/4 + random(-1,1) * wobble, 
    y: canvas_y/4 + random(-1,1) * wobble
  };
  const pt3 = {
    x: canvas_x*3/4 + random(-1,1) * wobble, 
    y: canvas_y*3/4 + random(-1,1) * wobble
  };
  const pt4 = {
    x: canvas_x/4 + random(-1,1) * wobble, 
    y: canvas_y*3/4 + random(-1,1) * wobble
  };
  beginShape();
  for(let i=0; i<num_loops; i++){
    const radius = 10 * global_scale + i * loop_inc;
    two_seventy(pt1.x, pt1.y, radius, 0, -ang_step);
    two_seventy(pt2.x, pt2.y, radius, 90, -ang_step);
    two_seventy(pt3.x, pt3.y, radius, 180, -ang_step);
    two_seventy(pt4.x, pt4.y, radius, 270, -ang_step);
  }
  endShape();

  pop();
  
  global_draw_end();
}
//***************************************************
//custom funcs
function two_seventy(x_start, y_start, radius, rot, ang_step){
  for(let i=0; i<num_segments; i++){
    const x = x_start + radius * cos(rot + ang_step * i);
    const y = y_start + radius * sin(rot + ang_step * i);
    vertex(x,y);
  }
}