'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

function gui_values(){
  parameterize("num_lines", floor(base_y * 3/4), 1, base_y, 1, false);
  parameterize("num_pts", floor(base_x * 3/4), 1, base_x, 1, false);
  parameterize("y_margin", base_y/4, -base_y/2, base_y/2, 1, true);
  parameterize("amplitude", base_y/2, 1, base_y, 1, false);
} 

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();
  push();
  const line_step = (canvas_y - y_margin)/num_lines;
  const pt_step = canvas_x/num_pts;
  translate(0, y_margin/2);

  let last_y;
  for(let i=0; i<num_lines; i++){
    push();
    translate(0, i * line_step);
    beginShape();
    for(let j=0; j<num_pts; j++){
      let x = j * pt_step;
      let y = map(noise(i/100, j/100), 0,1, -amplitude, amplitude);
      y = map(noise(1000 + y/100), 0, 1, -amplitude/2, amplitude/2);
      vertex(x,y);
      last_y = y;
    }
    
    vertex(width *2, last_y);
    vertex(width * 2, height*2);
    vertex(-width*2, height *2);
    
    
    endShape(CLOSE);
    pop();
  }
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
