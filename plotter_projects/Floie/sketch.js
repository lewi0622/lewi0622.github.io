'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

function gui_values(){
  parameterize("cols", 2, 1, 50, 1, false);
  parameterize("margin_x", base_x/16, -base_x, base_x, 1, true);
  parameterize("margin_y", base_y/16, -base_y, base_y, 1, true);
  parameterize("thickness", 3, 0.1, 10, 0.1, true);
  parameterize("skew_pct", random(-1,1), -1, 1, 0.01, false);
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
  const weight = PILOTPRECISEV5*global_scale;
  const num_passes = 1//round(thickness/weight)*2;
  
  const rows = 2;
  const rect_width = (canvas_x - margin_x*2)/cols;
  const rect_height = (canvas_y - margin_y*2)/rows;
  const iterations = floor(min(rect_width/thickness, rect_height/thickness)/4);
  const skew_step = rect_height * skew_pct / iterations;
  
  noFill();
  translate(margin_x, margin_y);
  rectMode(CENTER);

  for(let i=0; i<cols; i++){
    push();
    translate(i * rect_width + rect_width/2, rect_height/2);
    for(let k=0; k<iterations; k++){
      for(let j=0; j<num_passes; j++){
        push();
        tilted_rect((k+1) * thickness*4 + j * weight/2, (k+1) * thickness*4 + j * weight/2, (k+1) * skew_step);
        translate(0,rect_height/2);
        rotate(180);
        translate(0,-rect_height/2);
        tilted_rect((k+1) * thickness*4 + j * weight/2, (k+1) * thickness*4 + j * weight/2, (k+1) * skew_step);
        pop();
      }
    }
    pop();
  }

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs
function tilted_rect(w,h, skew){
  beginShape();
  vertex(-w/2, -h/2);
  vertex(w/2, -h/2);
  vertex(w/2, h/2+skew);
  vertex(-w/2, h/2-skew);
  endShape(CLOSE);
}