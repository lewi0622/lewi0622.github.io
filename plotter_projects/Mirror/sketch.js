'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

suggested_palettes = []


function gui_values(){
  parameterize("step_number", 15, 1, 500, 1, false);
  parameterize("amp", 10, 0, 100, 1, true);
  parameterize("line_number", 20, 1, 100, 1, false);
  parameterize("inc_per_line", 10, 0, 50, 0.1, true);
  parameterize("minimum_x", 5, 0, 100, 1, true);
  parameterize("i_damp", 1, 0.01, 2, 0.01, false);
  parameterize("j_damp", 50, 1, 100, 1, false);
}

function setup() {
  common_setup(5*96, 7*96, SVG);
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  noFill();
  translate(canvas_x/2, 0);
  let last_x = new Array(step_number+1).fill(0);

  const step_size = canvas_y/step_number;
  let amplitude = amp;
  let dir = 1;
  for(let j=0; j<line_number; j++){
    beginShape();
    vertex(0,0);
    if(j%2==0) dir = -1;
    else dir = 1;
    let x, y;
    for(let i=0; i<=step_number; i++){
      x = amplitude*noise(i/i_damp, j/j_damp);
      if(x<last_x[i]) x += minimum_x;
      if(i/step_number<0.25 || i/step_number>0.75) x /= 2;
      y = i*step_size;
      curveVertex(dir*x,y);
      last_x[i] = x;
    }
    curveVertex(x,y);
    endShape();
    amplitude += inc_per_line;
  }
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs

