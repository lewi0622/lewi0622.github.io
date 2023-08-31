'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

let x_fourth, y_fourth, copic_palette;
suggested_palettes = []

function gui_values(){
  parameterize("line_segments", 150, 3, 400, 1, false); //250
  parameterize("number_of_lines", 200, 1, 400, 1, false);//215
  parameterize("curve_tightness", 0, -5, 5, 0.1, false);//0
  parameterize("x_amp", 60, 1, 500, 1, true);//360
  parameterize("y_amp", 75, 1, 500, 1, true);//193
  parameterize("x_i_damp", 20, 1, 500, 1, false);//500
  parameterize("x_j_damp", 40, 1, 500, 1, false);//480
  parameterize("y_i_damp", 10, 1, 500, 1, false);//130
  parameterize("y_j_damp", 100, 1, 500, 1, false);//500
  parameterize("octaves", 4, 1, 8, 1, false);//5
  parameterize("falloff", 0.5, 0.1, 1, 0.1, false);//0.7
} 

function setup() {
  common_setup(6*96, 8*96, SVG);
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();

  //actual drawing stuff
  push();
  noFill();
  const segment_step_size = canvas_x/line_segments;
  const line_step_size = canvas_y/number_of_lines;
  const y_noise_offset = random(-500, 500);
  curveTightness(curve_tightness);
  noiseDetail(octaves, falloff);
  for(let j=0; j<number_of_lines; j++){
    push();
    translate(0, j*line_step_size);
    beginShape();
    for(let i=0; i<line_segments; i++){
      const x = i*segment_step_size + map(noise(i/x_i_damp, j/x_j_damp), 0,1, -x_amp, x_amp);
      const y = map(noise((i + y_noise_offset)/y_i_damp, j/y_j_damp), 0,1, -y_amp, y_amp);
      curveVertex(x,y);
    }
    endShape();
    pop();
  }
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
