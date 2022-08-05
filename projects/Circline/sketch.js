gif = false;
fr = 1;

capture = false;
capture_time = 10
function setup() {
  suggested_palette = random([SUMMERTIME, MUTEDEARTH, SIXTIES]);
  common_setup(gif);
}
//***************************************************
function draw() {  
  capture_start(capture);

  //bleed
  bleed_border = apply_bleed();

  working_palette = JSON.parse(JSON.stringify(palette));

  //apply background
  line_length = random([25, 40])*global_scale;
  circle_x = canvas_x/line_length;
  circle_y = canvas_y/line_length;
  random([bg_vertical_strips, bg_horizontal_strips])(random([2,3,4]));

  //actual drawing stuff
  push();
  translate(line_length/2, line_length/2);
  for(let i=0; i<circle_x; i++){
    for(let j=0; j<circle_y; j++){
      push();
      noStroke();
      fill(random(palette));
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