'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 8


function gui_values(){

}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();

  const colors = gen_n_colors(2);
  //actual drawing stuff
  push();

  strokeWeight(1*global_scale);

  noFill();

  translate(canvas_x/2, canvas_y/2);
  const num_circles = 25;
  stroke(colors[0]);
  for(let i=0; i<num_circles; i++){
    rotate(20);
    push();
    if(i%4==0){
      fill(colors[1]);
    }
    circle(0,i*global_scale*5, 5*global_scale*i + 5*global_scale);
    pop();
  } 
  
  pop();

  global_draw_end();
}
//***************************************************
//custom funcs


