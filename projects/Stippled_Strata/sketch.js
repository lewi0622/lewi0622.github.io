'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = []


function gui_values(){
  parameterize("x_pts", 300, 100, 10000, 10, false);
  parameterize("y_pts", 400, 100, 10000, 10, false);
  parameterize("x_noise_damp", 150, 1, 500, 1, false);
  parameterize("y_noise_damp", 10, 1, 500, 1, false);
  parameterize("x_sin_damp", 80, 1, 500, 1, false);
  parameterize("y_sin_damp", 1, 1, 500, 1, false);
  parameterize("pt_size", 1.5, 0.1, 20, 0.1, true);
}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();

  working_palette = controlled_shuffle(working_palette, true);

  push();
  const x_step = canvas_x/x_pts;
  const y_step = canvas_y/y_pts;
  strokeWeight(pt_size);
  for(let i=0; i<x_pts; i++){
    for(let j=0; j<y_pts; j++){
      const x = x_step * i;
      const y = y_step * j;
      const c = color_map(x,y);
      // c.setAlpha(100);
      stroke(c);
      line(x,y, x+0.1,y+0.1);
    }
  }
  
  pop();

  global_draw_end();
}
//***************************************************
//custom funcs
function color_map(x,y){
  x = x / global_scale;
  y = y / global_scale;
  const y_displacement = 250;
  y += y_displacement * noise(x/100,y/100);
  let n = noise(x / x_noise_damp, y / y_noise_damp);
  n += sin(x / x_sin_damp + y / y_sin_damp);
  const c_id = floor(map(n, -1,2, 0, working_palette.length));
  return color(working_palette[c_id]);
}