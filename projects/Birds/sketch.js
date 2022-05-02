gif = false;
fr = 1;

capture = false;
capture_time = 10
num_frames = capture_time*fr;
capturer = new CCapture({format:'png', name:String(fr), framerate:fr});
function setup() {
  //default palette for this sketch only
  default_palette = random([2, 5, 6]);
  common_setup(gif);
  if(!capture){
    frameRate(fr);
  }
}
//***************************************************
function draw() {
  capture_start(capture);

  //bleed
  bleed_border = apply_bleed();

  working_palette = [...palette];

  //apply background
  bg_c = random(working_palette)
  background(bg_c)
  reduce_array(working_palette, bg_c)

  //actual drawing stuff
  push();
  eye_white = [255, 255, 255, 255];
  eye_black = [0, 0, 0, 255];

  noStroke();
  push();
  //head and eye
  translate(canvas_x/4, canvas_y/4);
  head();
  // beak
  translate(canvas_x/4, 0);
  beak();
  pop();

  push();
  //head and eye
  translate(canvas_x*3/4, canvas_y*3/4);
  head();
  // beak
  translate(-canvas_x/4, 0);
  beak(true);
  pop();

  pop();
  //cleanup
  apply_cutlines();

  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs
function head(){
  fill(random(working_palette));
  square(-canvas_x/4, -canvas_x/4, 200*global_scale);
  fill(eye_white);
  eye_size = random(75,125);
  circle(0,0, eye_size*global_scale);
  fill(random(palette))
  circle(0,0,eye_size*3/4*global_scale);
  fill(eye_black);
  circle(0,0,eye_size*1/2*global_scale);
}
function beak(reverse){
  if(reverse==true){
    rev = -1;
  }
  else{
    rev = 1;
  }
  fill(random(working_palette));
  triangle(0,0, 0,-canvas_y/4, canvas_x/2*rev,0);
  fill(random(working_palette));
  triangle(0,0, 0,canvas_y/4, canvas_x/2*rev,0);
}