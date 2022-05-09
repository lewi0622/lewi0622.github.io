gif = false;
fr = 1;

capture = false;
capture_time = 10;
function setup() {
  suggested_palette = random([BUMBLEBEE, SUMMERTIME, SOUTHWEST]);
  common_setup(gif);
}
//***************************************************
function draw() {
  capture_start(capture);

  //bleed
  bleed_border = apply_bleed();

  palette = shuffle(palette);
  //apply background
  random([bg_horizontal_strips,bg_vertical_strips])(2);

  //actual drawing stuff
  push();
  noFill();
  base_size = random(20,25);
  size = palette.length*base_size*global_scale;

  //reorder palette
  shuffle(palette);

  for(let i=0; i<palette.length; i++){
    push();
    strokeWeight(size);
    stroke(palette[i]);
    triangle(0, canvas_y, canvas_x/4, canvas_y/4, -canvas_x/4, canvas_y/4);
    center_rotate(180);
    triangle(0, canvas_y, canvas_x/4, canvas_y/4, -canvas_x/4, canvas_y/4);
    
    size -= base_size*global_scale;
    pop();
  }
  pop();
  //cutlines
  apply_cutlines();

  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs