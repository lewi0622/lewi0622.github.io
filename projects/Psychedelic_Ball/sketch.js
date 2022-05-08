gif = false;
fr = 1;

capture = false;
capture_time = 10;
function setup() {
  common_setup(gif);
  change_default_palette(random([BEACHDAY, COTTONCANDY, SOUTHWEST]));
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
  alt = random([0,1])==0;

  for(let i=0; i<canvas_x+Math.abs(ribbon_w); i+=random([2,4,6,8])*global_scale){
    for(let j=0; j<canvas_y; j+=ribbon_h){
      if(alt){
        if(i%2==0){
          ribbon_w = ribbon_w*-1;
        }
      }
      push();
      translate(i,j);
      fill(random(palette));
      ribbon_curl(ribbon_h,ribbon_w);
      pop();
    }
  }
  pop();
  if(random([true, false])){
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

