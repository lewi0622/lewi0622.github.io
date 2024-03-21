'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = []


function gui_values(){
  parameterize("num_circles", 50, 1, 200, 1, false);
  parameterize("radius_start", 0, -400, 400, 1, true);
  parameterize("radius_end", 150, -400, 400, 1, true);
  parameterize("shape_spacing", 150, -400, 400, 1, true);
  parameterize("num_circle_segments", 200, 1, 500, 1, false);
  parameterize("angle_round_end", 270, 0, 360, 1, false);
  parameterize("sym_angs", 2, 1, 8, 1, false);
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
  translate(canvas_x/2, canvas_y/2);
  const ang_step = 360/sym_angs;
  for(let i=0; i<sym_angs; i++){
    push();
    stroke(i);
    rotate(ang_step * i);
    translate(shape_spacing, shape_spacing);
    rotate(-90);
    concentric();
    pop();
  }
 
  pop();
  
  global_draw_end();
}
//***************************************************
//custom funcs

function concentric(){
  const ang_step = 360/num_circle_segments;
  for(let i =0; i<num_circles; i++){
    const radius = lerp(radius_start, radius_end, i/num_circles);
    beginShape();
    for(let j=0; j<num_circle_segments; j++){
      const theta = j * ang_step;
      if(theta>angle_round_end) break;
      const x = radius * cos(theta);
      const y = radius * sin(theta);
      vertex(x,y);
    }
    endShape(CLOSE);
  }
}