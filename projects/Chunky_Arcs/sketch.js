gif = false;
fr = 1;

capture = false;
capture_time = 10
num_frames = capture_time*fr;
capturer = new CCapture({format:'png', name:String(fr), framerate:fr});
function setup() {
  common_setup(gif);
  change_default_palette(random([6, 8, 12]));
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
  strokeCap(random([PROJECT,ROUND]))

  //apply background
  bg_c = random(working_palette)
  background(bg_c)
  reduce_array(working_palette, bg_c)

  //actual drawing stuff
  push();
  arcing(canvas_x);
  pop();
  //cutlines
  apply_cutlines();

  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs
function arcing(width){
  push();
  noFill();

  translate(canvas_x/2, canvas_y/2);
  let old_SW = 5*global_scale;
  let old_radius = canvas_x/20;
  let radius = 0;
  let angles = random(70, 100);

  rotate(random(0,360));
  while(radius < canvas_x-50*global_scale){
    radius = old_radius+old_SW*2+random(5,6)*global_scale;
    sw = radius - old_radius - old_SW -5*global_scale;

    stroke(random(working_palette));
    strokeWeight(sw);

    arc(0, 0, radius, radius, 0, angles);
    arc(0, 0, radius, radius, 180, 180+angles);
    rotate(20);

    old_SW = sw;
    old_radius = radius;
  }
  pop();
}


