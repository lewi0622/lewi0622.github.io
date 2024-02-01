'use strict';
//setup variables
let gif = true;
let animation = true;
const fr = 30;
const capture = false;
const capture_time = 20;

const suggested_palettes = [];

let square_rotation;
let bg_c, c;

function gui_values(){
  parameterize("square_rotation_inc", 80, 0, 360, 1, false);
  parameterize("cols", 2, 1, 200, 1, false);
  if(type == "svg") parameterize("frame", 0, 0, 1000, 1, false);
}

function setup() {
  common_setup();
  square_rotation = 0;
  if(type == "svg"){
    noLoop();
    gif = false;
    animation = false;
  }
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  if(type == "svg"){
    noFill();
    square_rotation = square_rotation_inc*frame;
  }
  else{
    background("WHITE");
    fill("BLACK");  
    noStroke();
  }

  rectMode(CENTER);

  const step_x = canvas_x/cols;
  const rows = floor(canvas_y/step_x);
  translate(step_x/2, step_x/2);
  let index_count = 1;
  for(let i=0; i<cols; i++){
    for(let j=0; j<rows; j++){
      push();
      translate(step_x*i, step_x*j);
      let lerp_amt = dist(step_x*i, step_x*j, canvas_x/2-step_x/2, canvas_y/2-step_x/2)/canvas_y/2;
      rotate(lerp(0, square_rotation, lerp_amt));
      square(0,0, step_x);
      pop();
      index_count++;
    }
  }
  
  square_rotation += square_rotation_inc;

  if(type != "svg"){
    if(cols < 100 && frameCount % 10 == 0){
      if(cols < 20) cols += 2;
      else cols += 10;
    }
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
