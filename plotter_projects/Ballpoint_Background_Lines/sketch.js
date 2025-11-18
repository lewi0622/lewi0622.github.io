'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

/*
Lasted about half of a 18x24 design before the pen ran out, looked pretty cool though
*/

function gui_values(){
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
  const weight = BICCRISTAL * global_scale;
  strokeWeight(weight);
  const c = color(random(working_palette));
  c.setAlpha(20);
  stroke(c);
  noFill();

  const num_rows = round(canvas_y / weight);

  let overlap = 1;
  for(let i=0; i<num_rows; i++){
    for(let j=0; j<overlap; j++){
      line(0, weight * i, canvas_x, weight * i);
    }
    if(random()>0.95) overlap++;
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs