'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

let x_fourth, y_fourth, copic_palette;
const suggested_palettes = []

function gui_values(){
  parameterize("line_segments", round(0.043*canvas_x), 3, 400, 1, false); 
  parameterize("number_of_lines", round(0.46*canvas_y), 1, 400, 1, false); //standard lines for fineline: 353; standard lines for angled pitt pen: 115?
  parameterize("x_amp", 280, 1, 500, 1, true);
  parameterize("y_amp", 60, 1, 500, 1, true);
  parameterize("x_i_damp", 500, 1, 1000, 1, false);
  parameterize("x_j_damp", 500, 1, 1000, 1, false);
  parameterize("y_i_damp", 1, 1, 1000, 1, false);
  parameterize("y_j_damp", 500, 1, 1000, 1, false);
  parameterize("y_sin_amp", 200, 0, 400, 1, true);
  parameterize("sin_range", random(180), 0, 720, 1, false);
  parameterize("rotate_per_line", 0, -5, 5, 0.1, false);
} 

function setup() {
  common_setup(6*96, 8*96);
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();

  //actual drawing stuff
  push();

  const y_theta_offset = random(360);
  noFill();
  const segment_step_size = canvas_x/line_segments;
  const line_step_size = canvas_y/number_of_lines;
  // curveTightness(1);
  for(let j=0; j<number_of_lines; j++){
    rotate(rotate_per_line);
    // stroke(random(working_palette));
    beginShape();
    const y_base_loc = j*line_step_size;
    for(let i=0; i<line_segments; i++){
      const x_loc = i*segment_step_size;
      const y_loc = y_base_loc + y_sin_amp * sin(y_theta_offset + map(i/line_segments, 0,1, 0, sin_range));
      const x = x_loc + map(noise(x_loc/x_i_damp, y_loc/x_j_damp), 0,1, -x_amp, x_amp);
      const y = y_loc + map(noise(x_loc/y_i_damp, y_loc/y_j_damp), 0,1, -y_amp, y_amp);
      curveVertex(x,y);
    }
    endShape();
  }
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
