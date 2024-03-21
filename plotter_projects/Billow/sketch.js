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
  parameterize("x_move", 0, -400, 400, 1, true);
  parameterize("y_move", 0, -400, 400, 1, true);
  parameterize("single_line", 0, 0, 1, 1, false);
} 

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();

  //actual drawing stuff
  push();
  translate(x_move, y_move);
  const y_theta_offset = random(360);
  noFill();
  const segment_step_size = canvas_x*2/line_segments;
  const line_step_size = canvas_y*2/number_of_lines;
  // curveTightness(1);
  const lines = [];
  for(let j=0; j<number_of_lines; j++){
    rotate(rotate_per_line);
    // stroke(random(working_palette));
    const pts = [];
    const y_base_loc = j*line_step_size;
    for(let i=0; i<line_segments; i++){
      const x_loc = i*segment_step_size;
      const y_loc = y_base_loc + y_sin_amp * sin(y_theta_offset + map(i/line_segments, 0,1, 0, sin_range));
      const x = x_loc + map(noise(x_loc/x_i_damp, y_loc/x_j_damp), 0,1, -x_amp, x_amp);
      const y = y_loc + map(noise(x_loc/y_i_damp, y_loc/y_j_damp), 0,1, -y_amp, y_amp);
      pts.push([x,y]);
    }
    lines.push(pts);
  }

  let shape_began = false;
  lines.forEach((l,index) => {
    if(!shape_began || !single_line){
      beginShape();
      shape_began = true;
    }

    if(index%2==0){
      for(let i=0; i<l.length; i++){
        const pt = l[i];
        curveVertex(pt[0], pt[1]);
      }
    }
    else{
      for(let i=l.length-1; i>=0; i--){
        const pt = l[i];
        curveVertex(pt[0], pt[1]);
      }
    }
    if(!single_line) endShape();
  });

  if(single_line) endShape();

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
