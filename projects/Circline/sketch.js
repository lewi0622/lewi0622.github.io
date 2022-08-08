'use strict';
//setup variables
const gif = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
let suggested_palette;

function setup() {
  suggested_palette = random([SUMMERTIME, MUTEDEARTH, SIXTIES]);
  common_setup(gif);
}
//***************************************************
function draw() {  
  capture_start(capture);

  //bleed
  const bleed_border = apply_bleed();

  let working_palette = JSON.parse(JSON.stringify(palette));

  //apply background
  const line_length = random([25, 40])*global_scale;
  const circle_x = round(canvas_x/line_length);
  const circle_y = round(canvas_y/line_length);
  random([bg_vertical_strips, bg_horizontal_strips])(random([2,3,4]));
  console.log(line_length, circle_x, circle_y)
  //actual drawing stuff
  push();
  translate(line_length/2, line_length/2);
  for(let i=0; i<circle_x; i++){
    for(let j=0; j<circle_y; j++){
      push();
      noStroke();
      fill(random(working_palette));
      translate(i*line_length, j*line_length);
      circle(0, 0, random(line_length*.3, line_length));
      pop();
    }
  }
  pop();
  
  //cutlines
  apply_cutlines(bleed_border);

  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs