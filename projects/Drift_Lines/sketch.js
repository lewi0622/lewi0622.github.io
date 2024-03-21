'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [BUMBLEBEE, SIXTIES, SUPPERWARE]


function gui_values(){
  parameterize("line_length", 60, 10, 200, 1, true);
  parameterize("weight", 2, 0.1, 20, 0.1, true);
  parameterize("iterations", 50, 1, 200, 1, false);
  parameterize("x_offset", 20, 0, 100, 1, true);
  parameterize("y_offset", 20, 0, 100, 1, true);
}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();

  //project variables
  const cols = floor(canvas_x / line_length);
  const rows = floor(canvas_y / line_length);

  strokeCap(random([PROJECT,ROUND]));

  //apply background
  let bg_c = random(working_palette);
  if(type == "png") background(bg_c);
  reduce_array(working_palette, bg_c);

  //actual drawing stuff
  push();
  center_rotate(random([0, 90, 180, 270]));
  //line width
  strokeWeight(weight);
  
  //tile lines
  for(let i=0; i<iterations; i++){
    translate(random(x_offset), random(y_offset));
    for(let j=0; j<cols; j++){
      for(let k=0; k<rows; k++){
        push();
        translate(j*line_length, k*line_length);
        stroke(random(working_palette));
        translate(line_length/2, line_length/2);
        rotate(random([0,45,90,135,180,225,270,315]));
        line(-line_length/2,0, line_length/2, 0);
        pop();
      }
    }
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs