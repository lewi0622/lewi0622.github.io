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
  const varieties = [
    [150, 200, 0, 60, 75, 20, 40, 10, 100, 4, 0.5],
    [250, 215, 0, 360, 193, 500, 480, 130, 500, 5, 0.7],
    [round(random(10,100)), round(random(200,400)), 0, 60, 75, 193, 178, 8, 116, 8, 0.5]
  ]
  let variety = random(varieties);
  parameterize("line_segments", variety[0], 3, 400, 1, false);
  parameterize("number_of_lines", variety[1], 1, 400, 1, false);
  parameterize("curve_tightness", variety[2], -5, 5, 0.1, false);
  parameterize("x_amp", variety[3], 1, 500, 1, true);
  parameterize("y_amp", variety[4], 1, 500, 1, true);
  parameterize("x_i_damp", variety[5], 1, 500, 1, false);
  parameterize("x_j_damp", variety[6], 1, 500, 1, false);
  parameterize("y_i_damp", variety[7], 1, 500, 1, false);
  parameterize("y_j_damp", variety[8], 1, 500, 1, false);
  parameterize("octaves", variety[9], 1, 8, 1, false);
  parameterize("falloff", variety[10], 0.1, 1, 0.1, false);
} 

function setup() {
  common_setup();
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
