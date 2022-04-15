function setup() {
  common_setup();
}
//***************************************************
function draw() {
  //bleed
  bleed_border = apply_bleed();

  //apply background
  bg(true);

  //actual drawing stuff
  push();
  width = random([2,3])*global_scale;

  angle_step = random([18,24]);
  radius = random(175,200)*global_scale;

  //center
  translate(canvas_x/2, canvas_y/2);

  //setup so we don't do two beams of the same color
  lastColor=random(palette);
  c = lastColor;
  for(let i=0; i<360; i+=angle_step){
    push();
    //get new color, or if last step, get different color from first or previous
    if(i+angle_step >= 360 && palette.length>2){
      while(c == lastColor || c == c0){
        c = random(palette);
      }
    }
    else{
      while(c == lastColor){
        c = random(palette);
      }
    }
    fill(c)
    rotate(i);
    noStroke();

    beginShape();
    vertex(-width/2,-radius*.55);
    vertex(-width*100,-canvas_y*1.5);
    vertex(width*100,-canvas_y*1.5);
    vertex(width/2,-radius*.55);
    endShape(CLOSE);

    lastColor=c;
    pop();

    //capture first color
    if(i==0){
      c0=c;
    }
  }
  //apply overlap correction
  fill(c0);
  noStroke();
  beginShape();
  vertex(0, -radius*.55);
  vertex(-width/2, -radius*.55);
  vertex(-width*100, -canvas_y*1.5);
  vertex(0,-canvas_y*1.5);
  endShape(CLOSE);

  // circle 
  push();
  stroke(random(palette))
  strokeWeight(random(3,10)*global_scale);
  fill(random(palette));
  circle(0, 0, radius);
  pop();

  pop();

  if(random([0,1])){
    erase();
    noFill();
    cutoutCircle(canvas_y/64);
  }
  
  //cutlines
  apply_cutlines();
}
//***************************************************
//custom funcs
