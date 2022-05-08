gif = false;
fr = 1;

capture = false;
capture_time = 10
function setup() {
  common_setup(gif);
  change_default_palette(random([COTTONCANDY, BUMBLEBEE, SOUTHWEST]));
}
//***************************************************
function draw() {  
  capture_start(capture);

  //bleed
  bleed_border = apply_bleed();

  working_palette = [...palette];
  strokeCap(ROUND)

  //apply background
  bg_c = random(working_palette)
  background(bg_c)
  reduce_array(working_palette, bg_c)
  
  //actual drawing stuff
  push();
  pyramid = random(working_palette)
  reduce_array(working_palette, pyramid);

  noStroke();
  fill(pyramid);
  translate(canvas_x/2, canvas_y/2);
  leg = (canvas_y/2)/cos(30);
  hyp = leg * sin(30);
  triangle(0,0, hyp,canvas_y/2, -hyp,canvas_y/2);
  pop();

  arcing(canvas_x*.5, 0, 0);

  //cutlines
  apply_cutlines();

  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs
function arcing(width, linear_spread, rotation){
  push();
  noFill();
  translate(canvas_x/2, canvas_y/2);
  rotate(120);

  for(let i=100*global_scale; i<width; i=i+(1*global_scale)){
    radius = i * random(0.2, 2);
    stroke(random(working_palette));

    strokeWeight(random(1, 10)*global_scale)

    arc(0, 0, radius, radius, 0, random(150,330));
    
    rotate(random(0,rotation));
  }
  pop();
  // clean up pyramid
  push();
  noStroke();
  fill(pyramid);
  translate(canvas_x/2, canvas_y/2);
  pyr_dist = 10*global_scale;
  beginShape();
  vertex(0,0);
  vertex(0,pyr_dist);
  vertex(-hyp+pyr_dist,canvas_y/2);
  vertex(-hyp,canvas_y/2);
  endShape();
  pop();


}


