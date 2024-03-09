'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 8


function gui_values(){
  parameterize("line_steps", 200, 1, 500, 1, false);
  parameterize("number_of_lines", 20, 1, 200, 1, false);
  parameterize("splice_y", canvas_y/4, -500, 1000, 1, true);
  parameterize("join_y", canvas_y*3/4, -500, 1000, 1, true);
  parameterize("i_damp", 10, 1, 100, 1, false);
  parameterize("line_amp", 10, 1, 100, 1, true);
}

function setup() {
  common_setup();

}
//***************************************************
function draw() {
  global_draw_start();

  push();
  noFill();
  //determine left/right values
  const left_x = random(canvas_x/4, canvas_x/2);
  const right_x = random(canvas_x/2, canvas_x*3/4);
  const center_x = (left_x+right_x)/2;

  for(let j=0; j<number_of_lines; j++){
    meander(center_x, left_x, line_amp, j);
    meander(center_x, center_x, center_x/3, j);
    meander(center_x, right_x, line_amp, j);
  }
  pop();
  
  global_draw_end();
}
//***************************************************
//custom funcs

function meander(center_x, x_offset, max_amp, j){
  const y_step_size = canvas_y/line_steps;
  beginShape();
  for(let i=0; i<line_steps; i++){
    let amp = max_amp;
    const y = i*y_step_size;
    let x = x_offset;
    if(y < splice_y || y > join_y){
      amp = 10*global_scale;
      x = center_x;
    }
    x += map(noise(i/i_damp, j), 0,1, -amp, amp);
    vertex(x,y);
  }
  endShape();
}