'use strict';
//setup variables
const gif = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
let suggested_palette;

let gui_params = [];

function gui_values(){

}

function setup() {
  suggested_palette = random([BUMBLEBEE, SUMMERTIME, SOUTHWEST]);
  common_setup(gif);
}
//***************************************************
function draw() {
  capture_start(capture);

  //bleed
  const bleed_border = apply_bleed();

  palette = shuffle(palette, true);
  //apply background
  random([bg_horizontal_strips,bg_vertical_strips])(2);

  //actual drawing stuff
  push();
  noFill();
  const base_size = random(20,25);
  let tri_size = palette.length*base_size*global_scale;

  //reorder palette
  palette = shuffle(palette, true);

  for(let i=0; i<palette.length; i++){
    push();
    strokeWeight(tri_size);
    stroke(palette[i]);
    triangle(0, canvas_y, canvas_x/4, canvas_y/4, -canvas_x/4, canvas_y/4);
    center_rotate(180);
    triangle(0, canvas_y, canvas_x/4, canvas_y/4, -canvas_x/4, canvas_y/4);
    
    tri_size -= base_size*global_scale;
    pop();
  }
  pop();
  //cutlines
  apply_cutlines(bleed_border);

  capture_frame(capture);
}
//***************************************************
//custom funcs