'use strict';

//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;

function gui_values(){
  parameterize("line_steps", 100, 10, 1000, 1, true);
  parameterize("num_lines", 10, 1, 100, 1, false);
  parameterize('vertical_padding', 0, 0, 400, 1, true);
  parameterize("offset", 10, 0, 100, 1, true);
  parameterize('offset_inc', 5, -50, 50, 1, true);
  parameterize("rot", 0, 0, 360, 90);
}

function setup() {
  common_setup(500, 400, SVG);
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  center_rotate(rot);
  line_steps = floor(line_steps);
  let vertical_space = canvas_y-vertical_padding;
  let amp = 400*global_scale;
  translate(0, vertical_padding);
  for(let i=0; i<num_lines; i++){
    push();
    translate(0, i*vertical_space/num_lines);
    // let loop_amp = amp*(1-i/(num_lines*2));
    beginShape();
    for(let j=0; j<line_steps; j++){
      let loop_amp = amp*map(j/line_steps, 0,1, 1,0);
      const x = j*canvas_x/line_steps;
      const y = map(sin(x+offset), -1,1, -loop_amp, loop_amp);
      vertex(x,y)
    }
    endShape();
    offset += offset_inc;
    pop();
  }
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs