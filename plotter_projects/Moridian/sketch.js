'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 5;
const capture = false;
const capture_time = 50/fr;

const suggested_palettes = [];

function gui_values(){
  parameterize("rows", floor(base_y/2), 1, base_y, 1, false);
  parameterize("cols", floor(base_x/2), 1, base_x, 1, false);
  parameterize("max_angle", random(360, 1440), 0, 2880, 15, false);
  parameterize("skip_pct", random([0,random(0.1,0.3)]), 0, 1, 0.01, false);
  parameterize("x_damp", 100, 1, 400, 0.5, false);
  parameterize("y_damp", 100, 1, 400, 0.5, false);
  parameterize("margin_x", base_x/16, -base_x/2, base_x/2, 1, true);
  parameterize("margin_y", base_y/16, -base_y/2, base_y/2, 1, true);
}

//add margin
//add warp (a la eucalyptus and sagebrush)
//add density per color option

function setup() {
  common_setup();
  gui_values();
  noFill();
}
//***************************************************
function draw() {
  global_draw_start();
  push();
  strokeWeight(POSCA * global_scale);
  for(let i=0; i<working_palette.length; i++){
    working_palette[i] = color(working_palette[i]);
    working_palette[i].setAlpha(150);
  }
  working_palette = controlled_shuffle(working_palette, true);

  const col_step_size = (canvas_x - margin_x*2) / cols;
  const row_step_size = (canvas_y - margin_y*2) / rows;


  const x_offset = random(360);
  const y_offset = random(360);
  const num_x_warp = random(10);
  const num_y_warp = random(10);

  translate(margin_x, margin_y);

  for(let i=0; i<cols; i++){
    for(let j=0; j<rows; j++){
      push();
      const x_warp = margin_x/4 * sin(j*num_x_warp + x_offset)
      const y_warp = margin_y/4 * sin(i*num_y_warp + y_offset);
      translate(x_warp, y_warp);
      translate(i*col_step_size, j*row_step_size);
      const n = noise(i/x_damp, j/y_damp);
      line_meridian(n, col_step_size*2, row_step_size*2);
      pop();
    }
  }
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs

function line_meridian(n, w, h){
  if(random()<skip_pct) return;
  if(n < 0.2){
    stroke(working_palette[0%working_palette.length])
  } else if(n <0.4){
    stroke(working_palette[1%working_palette.length])
  } else if(n <0.6){
    stroke(working_palette[2%working_palette.length])
  } else if(n <0.8){
    stroke(working_palette[3%working_palette.length])
  }else{
    stroke(working_palette[4%working_palette.length])
  }
  rotate(map(n, 0,1, -max_angle, max_angle));
  line(0,0,w,h)
}