'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 8;

const suggested_palettes = [SAGEANDCITRUS, BEACHDAY, BIRDSOFPARADISE];

function gui_values(){
  const row_col = floor(random(2,6));
  parameterize("cols", row_col, 1, 20, 1, false);
  parameterize("rows", row_col, 1, 20, 1, false);
  parameterize("margin", random(0,50), 0, 100, 1, true);
  parameterize("shape_rad", random(20,60), 0, 200, 1, true);
  parameterize("pts", floor(random(30, 150)), 1, 200, 1, false);
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
  if(type != "svg") background(bg_c);
  strokeJoin(ROUND);
  strokeWeight(1*global_scale);

  noFill();
  const c1 = random(working_palette);
  reduce_array(working_palette, c1);
  const c2 = random(working_palette);
  stroke(c1);

  const x_spacing = (canvas_x - margin*2)/cols;
  const y_spacing = (canvas_y - margin*2)/rows;
  
  translate(margin + x_spacing/2, margin + y_spacing/2);
  for(let i=0; i<cols; i++){
    for(let j=0; j<rows; j++){
      push();
      translate(i*x_spacing, j*y_spacing);
      if(j==i) stroke(c2); //central row outline

      circle(0,0, shape_rad*2);
      beginShape();
      for(let z=0; z<pts; z++){
        const ang = random(360);
        vertex(shape_rad*cos(ang), shape_rad*sin(ang));
      }
      endShape();
      pop();
    }
  }

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs


