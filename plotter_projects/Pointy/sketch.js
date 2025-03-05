'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

function gui_values(){
  parameterize("rows", base_x, 0, base_x * 2, 1, false);
  parameterize("cols", base_y, 0, base_y * 2, 1, false);
  // parameterize("x_damp", 100, 1, 1000, 1, true);
  // parameterize("y_damp", 100, 1, 1000, 1, true);
} 

function setup() {
  common_setup();
  strokeWeight(global_scale);
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();
  //actual drawing stuff
  push();
  working_palette = controlled_shuffle(working_palette);

  const x_step = canvas_x/cols;
  const y_step = canvas_y/rows;

  for(let i=0; i<rows; i++){
    for(let j=0; j<cols; j++){
      const x_start = j * x_step
      const y_start = i * y_step;
      let x = x_start;
      let y = y_start;
      const dist_from_center = dist(x,y,canvas_x/2, canvas_y/2);
      const pct_from_center = dist_from_center/dist(0,0,canvas_x/2, canvas_y/2);
      
      let damp = lerp(100, 500, pct_from_center);
      damp *= random(0.96, 1);
      for(let k=0; k<50; k++){
        const angle = noise(x/global_scale/damp, y/global_scale/damp) * 360;
        x += global_scale * cos(angle);
        y += global_scale * sin(angle);
      }
      const c_idx = floor(lerp(0, working_palette.length-1, pct_from_center));
      stroke(working_palette[c_idx]);
      point(x,y);
    }
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
