'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 30;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];


function gui_values(){
  parameterize("iterations", 50, 1, 500, 1, false);
  parameterize("step_size", 5, 1, 50, 1, true);
  parameterize("num_lines", 50, 1, 5000, 1, false);
  parameterize("x_damp", 1, 1, 1000, 1, false);
  parameterize("y_damp", 1, 1, 1000, 1, false);
  parameterize("i_damp", 1, 1, 1000, 1, false);
  parameterize("num_colors", round(random(1, working_palette.length-1)), 1, working_palette.length-1, 1, false);
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
  png_bg(true);
  const colors = [];
  for(let i=0; i<num_colors; i++){
    colors.push(color(working_palette[i]));
  }
  for(let j=0; j<num_lines; j++){
    stroke(random(colors));
    const pts = [{x:random(-canvas_x/2, canvas_x*1.5), y:random(-canvas_y/2, canvas_y*1.5)}];
    beginShape();
    for(let i=0; i<iterations; i++){
      const starting_pt = pts[i];
  
      curveVertex(starting_pt.x, starting_pt.y);
  
      let angle = noise(starting_pt.x/global_scale/x_damp, starting_pt.y/global_scale/y_damp, i/i_damp) * 360*5;
      pts.push({
        x: starting_pt.x + step_size * cos(angle),
        y: starting_pt.y + step_size * sin(angle)
      });
    }
    endShape();
  }

  pop();
  
  global_draw_end();
}
//***************************************************
//custom funcs