'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 8
suggested_palettes = [BUMBLEBEE, SIXTIES, SUPPERWARE]


function gui_values(){
  parameterize("line_length", 60, 1, 150, 1, true);
  parameterize("iterations", 50, 1, 200, 1, false);
  parameterize("offset_max_col", 100, 0, 200, 1, true);
  parameterize("offset_max_row", 100, 0, 200, 1, true);
}


function setup() {
  common_setup(9.75*96, 5.5*96, SVG);
}
//***************************************************
function draw() {
  global_draw_start();

  //project variables
  const cols = canvas_x / line_length;
  const rows = canvas_y / line_length;

  let x_offset_min = 0;
  let y_offset_min = 0;

  //actual drawing stuff
  push();
  strokeWeight(2*global_scale);
  
  let i_offset = 0;
  let j_offset = 0;

  for(let loop_num = 0; loop_num < iterations; loop_num++){
    for(let i = 0; i < cols; i++){
      for(let j = 0; j < rows; j++){
        if(i*line_length + i_offset > canvas_x + line_length || j*line_length + j_offset > canvas_y + line_length){
          break;
        }
        push();
        stroke(random(working_palette));
        translate(i*line_length + i_offset, j*line_length + j_offset);
        if(random()>0.5)draw_cardinal(line_length);
        else draw_diag(line_length);
        pop();
      }
    }
    i_offset += random(x_offset_min, offset_max_col);
    j_offset += random(y_offset_min, offset_max_row);
  }

  pop();
  
  global_draw_end();
}
//***************************************************
//custom funcs