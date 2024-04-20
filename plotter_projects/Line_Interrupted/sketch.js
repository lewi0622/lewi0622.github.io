'use strict';

//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

function gui_values(){
  parameterize("step_size", 5, 1, 20, 1, true);
  parameterize("line_spacing", 2, 0.01, 10, 0.01, true);
  parameterize("xnoise_div", 100, 1, 1000, 10,false);
  parameterize("xnoise_off", 0, -50, 50, 1, false);
  parameterize("ynoise_div", 100, 1, 1000, 10,false);
  parameterize("ynoise_off", 0, -50, 50, 1, false);
  parameterize("noise_size", 3, 0.1, 500, 1, true);
  parameterize("num_colors", round(random(1, working_palette.length-1)), 1, working_palette.length-1, 1, false);
}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  strokeWeight(0.5*global_scale);
  working_palette = controlled_shuffle(working_palette, true);
  png_bg(true);
  const colors = [];
  for(let i=0; i<num_colors; i++){
    colors.push(color(working_palette[i]));
    colors[i].setAlpha(200);
  }
  noFill();

  for(let j=0; j<num_colors; j++){
    const lines = [];
    let line_pos = 0;
    let line_max = canvas_x;
    while(line_pos<line_max){
      const line_points = [];
      for(let i=0; i<canvas_y; i+=step_size){
        line_points.push([map(noise((i + xnoise_off*i)/xnoise_div, (line_pos+ynoise_off)/ynoise_div, j), 0,1, -noise_size, noise_size), i]);
      }
      line_points.push([map(noise((canvas_y + xnoise_off*canvas_y)/xnoise_div, (line_pos+ynoise_off)/ynoise_div, j), 0,1, -noise_size, noise_size), canvas_y]);
      lines.push(line_points);
      line_pos += line_spacing;
    }
    stroke(colors[j]);
    lines.forEach((line_points, idx) => {
      push();
      translate(idx*line_spacing, 0);

      beginShape();
      line_points.forEach(points => vertex(...points));
      endShape();
      pop();
    });
  }

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs