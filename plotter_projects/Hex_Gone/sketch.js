'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 8


function gui_values(){
  parameterize("start_rad", 1, 1, 100, 1, true, grid_slider_1);
  parameterize("rad_inc", random(2,10), 1, 10, 1, true);
  parameterize("thic", 1, 1, 10, 1, false, grid_slider_2);
  parameterize("rot", random(360), 0, 360, 1, false, grid_slider_3);
  parameterize("num_hexes", floor(random(5,50)), 1, 100, 1, false, grid_slider_4);
  parameterize("num_colors", 2, 1, 5, 1, false);
}

function setup() {
  common_setup(6*96, 6*96);
}
//***************************************************
function draw() {
  global_draw_start();

  const colors = gen_n_colors(num_colors);
  //actual drawing stuff
  push();
  let hex_rad = start_rad + rad_inc*num_hexes;
  translate(canvas_x/2, canvas_y/2);
  for(let j=0; j<num_hexes; j++){
    rotate(j*rot);
    for(let z=0; z<thic; z++){
      stroke(random(colors));
      translate(0,0);
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

global_draw_end();
}
//***************************************************
