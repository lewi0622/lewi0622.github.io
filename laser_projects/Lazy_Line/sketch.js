'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 30;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

function gui_values(){
  parameterize("line_width", 10, 1, 100, 1, true);
  parameterize("num_lines", 50, 1, 100, 1, false);
  parameterize("line_steps", round(smaller_base/4), 1, smaller_base, 1, false);
  parameterize("x_damp", 50, 1, 200, 1, false);
  parameterize("y_damp", 50, 1, 200, 1, false);
  parameterize("y_amp", 100, 0, 500, 1, true);
}

function setup() {
  common_setup();
  gui_values();

}
//***************************************************
function draw() {
  global_draw_start();

  push();
  noFill();
  let line_color = 0;
  const y_offset = canvas_y / 2 - line_width / 2;
  const x_step_size = canvas_x/line_steps;

  for(let j=0; j<num_lines; j++){
    stroke(line_color);
    line_color++;
    //UPPER
    beginShape();
    //start in upper left corner
    vertex(0,0);
    //draw squiggle and save line for later
    let last_y;
    const squiggle = [];
    for(let i=0; i<=line_steps; i++){
      const x = i * x_step_size;
      last_y = map(noise(i/x_damp, j/y_damp), 0, 1, -y_amp, y_amp);
      vertex(x, last_y + y_offset);
      squiggle.push([x, last_y + y_offset]);
    }
    //finish shape
    vertex(canvas_x, 0);
    endShape(CLOSE);

    //LOWER
    beginShape();
    //start in lower left corner
    vertex(0,canvas_y);
    //draw squiggle
    for(let i=0; i<squiggle.length; i++){
      const x = squiggle[i][0];
      const y = squiggle[i][1];
      vertex(x, y + line_width);
    }
    //finish shape
    vertex(canvas_x, canvas_y);
    endShape(CLOSE);

    //show line instead of outline
    if(type == "png"){
      push();
      stroke(random(working_palette));
      strokeWeight(line_width / 3 * global_scale);
      translate(0, line_width / 2);
      beginShape();
      for(let i=0; i<squiggle.length; i++){
        const x = squiggle[i][0];
        const y = squiggle[i][1];
        vertex(x, y);
      }
      endShape();
      pop();
    }
  }
  pop();
  
  global_draw_end();
}
//***************************************************
//custom funcs