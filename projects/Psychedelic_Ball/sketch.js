'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
suggested_palettes = [BEACHDAY, COTTONCANDY, SOUTHWEST]


function gui_values(){
  let h_w_id = random([0,1,2]);
  parameterize("ribbon_h", [20,10,40][h_w_id],1,200,1,true);
  parameterize("ribbon_w", [70,10,100][h_w_id],-200,200,1,true);
  parameterize("i_inc", random([2,4,6,8]),1,50,1,true);
}

function setup() {
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

  const j_limit = round(canvas_y/ribbon_h);

  for(let i=-canvas_x*0.5; i<canvas_x*1.5; i+=i_inc){
    for(let j=0; j<=j_limit; j++){
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

