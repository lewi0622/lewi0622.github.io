'use strict';
//setup variables
const gif = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
let suggested_palette;


function gui_values(){

}

function setup() {
  suggested_palette = random([BEACHDAY, COTTONCANDY, SOUTHWEST]);
  common_setup(gif);
}
//***************************************************
function draw() {
  capture_start(capture);

  //bleed
  const bleed_border = apply_bleed();

  //apply background
  const bg_c = bg();

  const erase_or_bg = random()>0.5;

  //actual drawing stuff
  push();
  center_rotate(random(0,360));

  noStroke();
  const [h,w] = random([[20,70], [10,10], [40,100]]);
  const ribbon_h = h*global_scale;
  const ribbon_w = -w*global_scale;

  const j_limit = round(canvas_y/ribbon_h);

  for(let i=0; i<canvas_x*1.5; i+=random([2,4,6,8])*global_scale){
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
  apply_cutlines(bleed_border);

  capture_frame(capture);
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

