'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 8


function gui_values(){
  parameterize("start_rad", 5, 1, 100, 1, true);
  parameterize("rad_inc", 1, 1, 10, 1, true);
  parameterize("thic", 1, 1, 10, 1, false);
  parameterize("rot", 10, 0, 360, 1, false);
  parameterize("num_hexes", 10, 1, 100, 1, false);
}

function setup() {
  common_setup(gif, SVG);
}
//***************************************************
function draw() {
  capture_start(capture);
  //bleed
  const bleed_border = apply_bleed();

  const colors = gen_n_colors(2);
  //actual drawing stuff
  push();
  let hex_rad = start_rad + rad_inc*num_hexes;
  translate(canvas_x/2, canvas_y/2);
  for(let j=0; j<num_hexes; j++){
    rotate(j*rot);
    for(let z=0; z<thic; z++){
      beginShape();
      for(let i=0; i<6; i++){
        const x = (hex_rad-z*global_scale/2)*cos(60*i);
        const y = (hex_rad-z*global_scale/2)*sin(60*i);
        vertex(x,y);
      }
      endShape(CLOSE);
    }
    hex_rad -= rad_inc;
  }

  pop();

  //cleanup
  apply_cutlines(bleed_border);

  capture_frame(capture);
}
//***************************************************
//custom funcs


