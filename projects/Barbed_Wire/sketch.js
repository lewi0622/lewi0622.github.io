// 'use strict';
//setup variables
const gif = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
let suggested_palette;

function setup() {
  suggested_palette = random([SAGEANDCITRUS, COTTONCANDY, MUTEDEARTH]);
  common_setup(gif);
}
//***************************************************
function draw() {
  capture_start(capture);
  //bleed
  const bleed_border = apply_bleed();

  const num_pts = 1000;
  xPos = 0;
  yPos = canvas_y/2;

  let working_palette = JSON.parse(JSON.stringify(palette));

  //apply background
  random([bg_vertical_strips, bg_horizontal_strips])(random([2,3,4]));

  //actual drawing stuff
  push();
  center_rotate(random([0, 180]));

  strokeCap(SQUARE);
  strokeWeight(30*global_scale)
  noFill();
  shape_type=TRIANGLES
  beginShape(shape_type);

  for(let i=0; i<num_pts; i++){
    stroke(random(working_palette));
    //vertex
    vertex(xPos, yPos);

    //move
    xPos += random(-5,10)*global_scale;
    yPos += random(-4,4)*global_scale;

    //check for wrapping
    wrap(undefined, canvas_y/2);
  }
  //don't stroke last line to avoid one that ends in the middle of the page
  noStroke();
  endShape();
  
  pop();
  //cutlines
  apply_cutlines(bleed_border);

  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs
function wrap(force_x, force_y){
  //-x, -y
  if(xPos < 0 && yPos < 0){
    vertex(xPos, yPos);
    endShape();

    xPos = canvas_x;
    yPos = canvas_y;
    xPos = force_num(xPos, force_x);
    yPos = force_num(yPos, force_y);

    
    beginShape(shape_type);
    return;
  }

  //-x, +y
  if(xPos < 0 && yPos > canvas_y){
    vertex(xPos, yPos);
    endShape();
    
    xPos = canvas_x;
    yPos = 0;
    xPos = force_num(xPos, force_x);
    yPos = force_num(yPos, force_y);
    
    beginShape(shape_type);
    return;
  }

  //+x, +y
  if(xPos > canvas_x && yPos > canvas_y){
    vertex(xPos, yPos);
    endShape();
    
    xPos = 0;
    yPos = 0;
    xPos = force_num(xPos, force_x);
    yPos = force_num(yPos, force_y);
    
    beginShape(shape_type);
    return;
  }

  //+x, -y
  if(xPos > canvas_x && yPos < 0){
    vertex(xPos, yPos);
    endShape();
    
    xPos = 0;
    yPos = canvas_y;
    xPos = force_num(xPos, force_x);
    yPos = force_num(yPos, force_y);
    
    beginShape(shape_type);
    return;
  }

  //-x
  if(xPos < 0){
    vertex(xPos, yPos);
    endShape();

    xPos = canvas_x;
    yPos = force_num(yPos, force_y);

    beginShape(shape_type);
    return;
  }
  
  //+x
  if(xPos > canvas_x){
    vertex(xPos, yPos);
    endShape();

    xPos = 0;
    yPos = force_num(yPos, force_y);

    beginShape(shape_type);
    return;
  }

  //-y
  if(yPos < 0){
    vertex(xPos, yPos);
    endShape();

    yPos = canvas_y;
    xPos = force_num(xPos, force_x);

    beginShape(shape_type);
    return;
  }
  
  //+y
  if(yPos > canvas_y){
    vertex(xPos, yPos);
    endShape();

    yPos = 0;
    xPos = force_num(xPos, force_x);

    beginShape(shape_type);
    return;
  }
}

function force_num(pos, force){
  if(force !== undefined){
    return force;
  }
  return pos;
}