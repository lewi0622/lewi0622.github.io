'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

let square_rotation;
let bg_c, c;

function gui_values(){
  parameterize("square_rotation_inc", 80, 0, 360, 1, false);
  parameterize("squares_per_row", 100, 1, 200, 1, false);
}

function setup() {
  common_setup();
  square_rotation = 0;
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  background("WHITE");
  fill("BLACK");
  rectMode(CENTER);
  noStroke();


  const step_x = width/squares_per_row;
  translate(step_x/2, step_x/2);
  let index_count = 1;
  // const index_total = squares_per_row*2;
  for(let i=0; i<squares_per_row; i++){
    for(let j=0; j<squares_per_row; j++){
      push();
      translate(step_x*i, step_x*j);
      // let lerp_amt = 1-(index_count/index_total);
      let lerp_amt = dist(step_x*i, step_x*j, width/2, height/2)/width/2;
      rotate(lerp(0, square_rotation, lerp_amt));
      square(0,0, step_x);
      pop();
      index_count++;
    }
  }
  
  square_rotation += square_rotation_inc;

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
