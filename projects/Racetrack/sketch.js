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
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();

  //apply background
  push();
  if(type != "svg") background("WHITE");
  noFill();

  const ang_step = -270/num_segments;
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

  let lastpt = {x:"", y:""};
  let stroke_c = 0;
  for(let i=0; i<num_loops; i++){
    const radius = 10 * global_scale + i * loop_inc;
    // stroke(stroke_c);
    beginShape();
    if(lastpt.x != "") vertex(lastpt.x, lastpt.y);
    for(let i=0; i<num_segments; i++){
      const x = pt1.x + radius * cos(0 + ang_step * i);
      const y = pt1.y + radius * sin(0 + ang_step * i);
      vertex(x,y);
    }

    for(let i=0; i<num_segments; i++){
      const x = pt2.x + radius * cos(90 + ang_step * i);
      const y = pt2.y + radius * sin(90 + ang_step * i);
      vertex(x,y);
    }

    for(let i=0; i<num_segments; i++){
      const x = pt3.x + radius * cos(180 + ang_step * i);
      const y = pt3.y + radius * sin(180 + ang_step * i);
      vertex(x,y);
    }

    for(let i=0; i<num_segments; i++){
      const x = pt4.x + radius * cos(270 + ang_step * i);
      const y = pt4.y + radius * sin(270 + ang_step * i);
      vertex(x,y);
      lastpt.x = x;
      lastpt.y = y;
    }
    endShape();
    stroke_c++;
  }

  pop();
  
  global_draw_end();
}
//***************************************************
//custom funcs
function two_seventy(x_start, y_start, radius, rot, ang_step){
  beginShape();
  for(let i=0; i<num_segments; i++){
    const x = x_start + radius * cos(rot + ang_step * i);
    const y = y_start + radius * sin(rot + ang_step * i);
    vertex(x,y);
  }
  endShape();
}