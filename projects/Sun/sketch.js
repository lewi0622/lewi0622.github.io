'use strict';
//setup variables
const gif = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
let suggested_palette;

function setup() {
  suggested_palette = random([BEACHDAY, SUMMERTIME, SUPPERWARE]);
  common_setup(gif);
}
//***************************************************
function draw() {
  capture_start(capture);

  //bleed
  const bleed_border = apply_bleed();
  
  const cutout = random()>0.5;
  let working_palette = JSON.parse(JSON.stringify(palette));
  strokeCap(random([PROJECT,ROUND]))

  //apply background
  const bg_c = random(working_palette)
  background(bg_c)
  reduce_array(working_palette, bg_c)

  //actual drawing stuff
  push();
  const width = random([2,3])*global_scale;

  const angle_step = random([18,24]);
  const radius = random(175,200)*global_scale;

  //center
  translate(canvas_x/2, canvas_y/2);

  //setup so we don't do two beams of the same color
  let lastColor=random(working_palette);
  let c = lastColor;
  let c0;
  for(let i=0; i<360; i+=angle_step){
    push();
    //get new color, or if last step, get different color from first or previous
    if(i+angle_step >= 360 && working_palette.length>2){
      while(c == lastColor || c == c0){
        c = random(working_palette);
      }
    }
    else{
      while(c == lastColor){
        c = random(working_palette);
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
  stroke(random(working_palette))
  strokeWeight(random(3,10)*global_scale);
  fill(random(working_palette));
  circle(0, 0, radius);
  pop();

  pop();

  if(cutout){
    erase();
    noFill();
    cutoutCircle(canvas_y/64);
    noErase();
  }
  
  //cutlines
  apply_cutlines(bleed_border);

  capture_frame(capture);
}
//***************************************************
//custom funcs
