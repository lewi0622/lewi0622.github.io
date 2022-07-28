gif = false;
fr = 1;

capture = false;
capture_time = 10
function setup() {
  suggested_palette = random([SAGEANDCITRUS, SOUTHWEST, NURSERY]);
  common_setup(gif);
}
//***************************************************
function draw() {
  capture_start(capture);

  //bleed
  bleed_border = apply_bleed();

  working_palette = JSON.parse(JSON.stringify(palette));
  strokeCap(random([PROJECT,ROUND]))

  //apply background
  bg_c = random(working_palette)
  background(bg_c)
  reduce_array(working_palette, bg_c)

  //actual drawing stuff
  push();
  linear_spread = floor(random([0, 2]))*global_scale;
  arcing(canvas_x*.75, linear_spread);
  pop();
  //cleanup
  apply_cutlines();

  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs
function arcing(limit, linear_spread){
  push();
  noFill();
  debug=0
  translate(canvas_x/2, canvas_y/2);
  for(let i=0; i<291; i++){
    offset = 10*global_scale;
    step_size = global_scale;
    translate(random(0,linear_spread), random(0, linear_spread));
    
    radius = (offset + step_size * i) * random(0.2, 3);
    stroke(random(palette));
    strokeWeight(random(1, 10)*global_scale);
    arc(0, 0, radius, radius, 0, random(45,300));
    rotate(random(0,360));
  }
  pop();
}


