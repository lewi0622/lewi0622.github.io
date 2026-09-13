'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];


function gui_values(){
  parameterize("lines_per_ring", 360, 1, 2000, 1, false);
  parameterize("rings", 10, 1, 100, 1, false);
  parameterize("min_line_length", 10, 1, 100, 1, true);
  parameterize("max_line_length", 30, 1, 200, 1, true);
  parameterize("algin_to_ring", random([0,1]), 0, 1, 1, false);
} 

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();
  push();
  png_bg(true);
  const c = color(random(working_palette));
  c.setAlpha(BICCRISTAL_ALPHA);
  if(type == "png") blendMode(MULTIPLY)
  stroke(c);
  strokeWeight(BICCRISTAL * global_scale);

  ring(0,0);
  ring(width, 0);
  ring(width/2, height/2);
  ring(0, height);
  ring(width, height);

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
function ring(x,y){
  push();
  translate(x,y);
  const angle_step = 360/lines_per_ring;
  for(let i=0; i<rings; i++){
    for(let j=0; j<lines_per_ring; j++){
       push();
       rotate(angle_step * j);
       translate(max_line_length * i, 0);
       if(algin_to_ring == 0) translate(random(-min_line_length, min_line_length), 0);
       line(0,0, random(min_line_length, max_line_length), 0);
       pop();
    }
  }  
  pop();
}

