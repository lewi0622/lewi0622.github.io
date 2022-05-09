gif = false;
fr = 1;

capture = false;
capture_time = 10
function setup() {
  suggested_palette = random([BIRDSOFPARADISE, SUMMERTIME, SIXTIES]);
  common_setup(gif);
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


