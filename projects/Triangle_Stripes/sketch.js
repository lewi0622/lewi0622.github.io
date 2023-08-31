'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

suggested_palettes = [BUMBLEBEE, SUMMERTIME, SOUTHWEST]


function gui_values(){

}

function setup() {
  common_setup();
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();
  
  working_palette = shuffle(working_palette, true);
  //apply background
  random([bg_horizontal_strips,bg_vertical_strips])(2);

  //actual drawing stuff
  push();
  noFill();
  const base_size = random(20,25);
  let tri_size = working_palette.length*base_size*global_scale;

  for(let i=0; i<working_palette.length; i++){
    push();
    strokeWeight(tri_size);
    stroke(working_palette[i]);
    triangle(0, canvas_y, canvas_x/4, canvas_y/4, -canvas_x/4, canvas_y/4);
    center_rotate(180);
    triangle(0, canvas_y, canvas_x/4, canvas_y/4, -canvas_x/4, canvas_y/4);
    
    tri_size -= base_size*global_scale;
    pop();
  }
  pop();
  
  global_draw_end();
}
//***************************************************
//custom funcs