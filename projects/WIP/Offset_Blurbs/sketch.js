'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
suggested_palettes = [SUMMERTIME]

function gui_values(){
  parameterize("num_rows", 10, 1, 100, 1, false);
  parameterize("num_cols", 10, 1, 100, 1, false);
  parameterize("max_square_size", 20, 0, 100, 1, true);
  parameterize("square_offset", 5, 0, 50, 1, true);
}

function setup() {
  common_setup(gif);
  rectMode(CENTER);
}
//***************************************************
function draw() {
  capture_start(capture);
  blendMode(modes[blend_mode]);
  //bleed
  const bleed_border = apply_bleed();

  refresh_working_palette();

  //apply background
  let bg_c = random(working_palette);
  background(bg_c)
  reduce_array(working_palette, bg_c)

  //actual drawing stuff
  push();
  noStroke();
  let grid_size = canvas_x/num_rows;
  for(let i=0; i<num_rows; i++){
    for(let j=0; j<num_cols; j++){
      push();
      let square_size = random(max_square_size/2, max_square_size);
      let square_color = color(random(working_palette));
      fill(square_color);
      translate(i*grid_size, j*grid_size);
      translate(square_size/2, square_size/2);
      push();
      translate(square_offset, square_offset);
      square_color.setAlpha(100);
      fill(square_color);
      square(0,0, square_size);
      pop();
      square(0,0, square_size);
      pop();
    }
  }
  //grain
  pop();
  push();
  noFill();
  stroke("#f3f0de");
  strokeWeight(global_scale*0.004);
  for(let i=0; i<60000; i++){
    circle(random(-canvas_x/2, canvas_x*1.5), random(-canvas_y/2, canvas_y*1.5), canvas_x/2);
  }
  pop();
  pop();
  //cutlines
  apply_cutlines(bleed_border);
  capture_frame(capture);
}
//***************************************************
//custom funcs




