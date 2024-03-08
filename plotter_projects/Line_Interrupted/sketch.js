'use strict';

//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;


function gui_values(){
  parameterize("step_size", 5, 1, 20, 1, true);
  parameterize("line_spacing", 10, 1, 50, 1, true);
  parameterize("xnoise_div", 100, 10, 1000, 10,false);
  parameterize("xnoise_off", 0, -50, 50, 1, false);
  parameterize("ynoise_div", 100, 10, 1000, 10,false);
  parameterize("ynoise_off", 0, -50, 50, 1, false);
  parameterize("noise_size", 3, 0.1, 500, 1, true);
}

function setup() {
  common_setup(6*96, 6*96);
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  noFill();
  const lines = [];
  let line_pos = 0;
  let line_max = canvas_x;
  //line_background'
  let line_skips = 0;
  let skip = false;
  let line_skip_chance = 0.01;
  while(line_pos<line_max){
    if(line_skips <= 0){
      line_skips = floor(random(10,20));
      skip = false;
    }
    const line_points = [];
    for(let i=0; i<canvas_y; i+=step_size){
      line_points.push([map(noise((i + xnoise_off*i)/xnoise_div, (line_pos+ynoise_off)/ynoise_div), 0,1, -noise_size, noise_size), i]);
    }
    line_points.push([map(noise((canvas_y + xnoise_off*canvas_y)/xnoise_div, (line_pos+ynoise_off)/ynoise_div), 0,1, -noise_size, noise_size), canvas_y]);
    if(random()>(line_skip_chance) && !skip) lines.push(line_points);
    else {
      lines.push([])
      line_skips--;
      skip = true;
    }
    line_pos += line_spacing;
  }
  let colors = [color(COPIC_R08), color(COPIC_B06)];
  colors.forEach(c => {
    c.setAlpha(150);
  });

  for(let i=0; i<1; i++){
    center_rotate(i*90);
    stroke(colors[i]);
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