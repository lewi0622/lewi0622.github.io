'use strict';

//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
suggested_palettes = [SOUTHWEST, NURSERY];

function gui_values(){
  parameterize("num_lines", 10, 1, 100, 1, false);
  parameterize("i_lines", 100, 1, 500, 1, false);
  parameterize("num_points", 100, 1, 500, 1, false);
  parameterize("amp", 30, 1, 50, 1, true);
  parameterize("point_noise_damp", 10, 1, 1000, 1, false);
}

function setup() {
  common_setup();
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  background("BLACK");
  noFill();
  strokeWeight(1);
  for(let i=0; i<i_lines; i++){
    stroke(map(i, 0,i_lines, 0, 256*2)%256);
    for(let j=0; j<=num_lines; j++){
      push();
      translate(j*canvas_x/num_lines, 0);
      beginShape();
      for(let z=0; z<=num_points; z++){
        const x = map(noise(i/100, j*100, z/point_noise_damp), 0,1, -amp, amp);
        vertex(x, z*canvas_y/num_points);
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