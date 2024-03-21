'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

function gui_values(){
  parameterize("number_of_dashes", 10, 1, 20, 1, false);
} 

function setup() {
  common_setup(11*96, 8.5*96, SVG);
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  const margin_from_center = 0.25*96;
  const colors = gen_n_colors(16);
  translate(canvas_x/2, canvas_y/2);
  for(let k=0; k<4; k++){
    push();
    rotate(k*90);
    translate(margin_from_center, margin_from_center);
    for(let i=0; i<colors.length; i++){
      stroke(colors[i]);
      for(let j=0; j<number_of_dashes; j++){
        push();
        translate(j*0.5*96, i*0.25*96);
        line(0,0, 0.25*96, 0);
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