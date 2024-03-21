'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 8


function gui_values(){
  parameterize('num_vertical_lines', 25, 1, 200, 1, false);
  parameterize('num_horizontal_lines', 25, 1, 200, 1, false);
  parameterize('vertical_points', 10, 1, 200, 1, false);
  parameterize('horizontal_points', 10, 1, 200, 1, false);
  parameterize("amp", 10, 0, 100, 0.1, true);
  parameterize("i_damp", 10, 1, 100, 1, false);
  parameterize("j_damp", 10, 1, 100, 1, false);
}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();
  push();
  translate(-canvas_x/2, -canvas_y/2);
  noFill();
  let c = color("BLUE");
  c.setAlpha(100);
  stroke(c);
  for(let i=0; i<num_vertical_lines; i++){
    beginShape();
    for(let j=0; j<=vertical_points; j++){
      let x = noise(i/i_damp, j/j_damp)*amp + i*canvas_x*1.5/num_vertical_lines;
      let y = j*canvas_y*1.5/vertical_points;
      vertex(x,y);
    }
    endShape();
  }

  c = color("RED");
  c.setAlpha(100);
  stroke(c);
  for(let i=0; i<num_horizontal_lines; i++){
    beginShape();
    for(let j=0; j<=horizontal_points; j++){
      let x = noise(i/i_damp, j/j_damp)*amp + i*canvas_y*1.5/num_horizontal_lines;
      let y = j*canvas_x*1.5/horizontal_points;
      vertex(y,x);
    }
    endShape();
  }
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs