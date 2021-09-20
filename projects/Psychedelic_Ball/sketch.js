function setup() {
  common_setup();
}
//***************************************************
function draw() {
  //bleed
  bleed_border = apply_bleed();

  //apply background
  bg_c = bg();

  //actual drawing stuff
  push();
  center_rotate(random(0,360));

  noStroke();

  ribbon_h = 20*global_scale;
  ribbon_w = -70*global_scale;
  for(let i=0; i<canvas_x+Math.abs(ribbon_w); i+=6*global_scale){
    for(let j=0; j<canvas_y; j+=ribbon_h){
      if(i%2==0){
        ribbon_w = ribbon_w*-1;
      }
      push();
      translate(i,j);
      fill(random(palette));
      ribbon_curl(ribbon_h,ribbon_w);
      pop();
    }
  }

  stroke(bg_c);

  noFill();
  cutoutCircle(canvas_y/8);
  pop();
  //cutlines
  apply_cutlines();
  
  save_drawing();
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

