gif = false;
fr = 1;

capture = false;
capture_time = 10;
function setup() {
  suggested_palette = random([BEACHDAY, COTTONCANDY, SOUTHWEST]);
  common_setup(gif);

  erase_or_bg = random()>0.5;
}
//***************************************************
function draw() {
  capture_start(capture);

  //bleed
  bleed_border = apply_bleed();

  //apply background
  bg_c = bg();

  //actual drawing stuff
  push();
  center_rotate(random(0,360));

  noStroke();
  [h,w] = random([[20,70], [10,10], [40,100]]);

  ribbon_h = h*global_scale;

  ribbon_w = -w*global_scale;

  j_limit = round(canvas_y/ribbon_h);

  debug_counter = 0;
  for(let i=0; i<canvas_x*1.5; i+=random([2,4,6,8])*global_scale){
    debug_counter++
    for(let j=0; j<j_limit; j++){
      push();
      translate(i,j*ribbon_h);
      fill(random(palette));
      ribbon_curl(ribbon_h,ribbon_w);
      pop();
    }
  }
  pop();
  if(erase_or_bg){
    stroke(bg_c);
  }
  else{
    erase();
  }
 
  noFill();
  cutoutCircle(canvas_y/8);
  noErase();
  //cutlines
  apply_cutlines();

  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs
function ribbon_curl(h, w){
  beginShape();
  vertex(0,0);
  bezierVertex(w, h/4, w, h*3/4, 0, h);
  bezierVertex(w/2, h*3/4, w/2, h/4, 0,0);
  endShape();
}

