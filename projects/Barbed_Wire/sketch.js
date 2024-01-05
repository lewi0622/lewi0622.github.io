'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [SAGEANDCITRUS, COTTONCANDY, MUTEDEARTH]


function gui_values(){

}

function setup() {
  common_setup();
}
//***************************************************
function draw() {
  global_draw_start();

  const num_pts = 1000;
  let xPos = 0;
  let yPos = canvas_y/2;

  refresh_working_palette();

  //apply background
  random([bg_vertical_strips, bg_horizontal_strips])(random([2,3,4]));

  //actual drawing stuff
  push();
  center_rotate(random([0, 180]));

  strokeCap(SQUARE);
  strokeWeight(30*global_scale)
  noFill();
  beginShape(TRIANGLES);

  for(let i=0; i<num_pts; i++){
    stroke(random(working_palette));
    //vertex
    vertex(xPos, yPos);

    //move
    xPos += random(-5,10)*global_scale;
    yPos += random(-4,4)*global_scale;

    //check for wrapping
    const pos = wrap(undefined, canvas_y/2, xPos, yPos);
    xPos = pos[0];
    yPos = pos[1];
  }
  //don't stroke last line to avoid one that ends in the middle of the page
  noStroke();
  endShape();
  
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
function wrap(force_x, force_y, xPos, yPos){
  //-x, -y
  if(xPos < 0 && yPos < 0){
    vertex(xPos, yPos);
    endShape();

    xPos = canvas_x;
    yPos = canvas_y;
    xPos = force_num(xPos, force_x);
    yPos = force_num(yPos, force_y);

    
    beginShape(TRIANGLES);
  }

  //-x, +y
  else if(xPos < 0 && yPos > canvas_y){
    vertex(xPos, yPos);
    endShape();
    
    xPos = canvas_x;
    yPos = 0;
    xPos = force_num(xPos, force_x);
    yPos = force_num(yPos, force_y);
    
    beginShape(TRIANGLES);
  }

  //+x, +y
  else if(xPos > canvas_x && yPos > canvas_y){
    vertex(xPos, yPos);
    endShape();
    
    xPos = 0;
    yPos = 0;
    xPos = force_num(xPos, force_x);
    yPos = force_num(yPos, force_y);
    
    beginShape(TRIANGLES);
  }

  //+x, -y
  else if(xPos > canvas_x && yPos < 0){
    vertex(xPos, yPos);
    endShape();
    
    xPos = 0;
    yPos = canvas_y;
    xPos = force_num(xPos, force_x);
    yPos = force_num(yPos, force_y);
    
    beginShape(TRIANGLES);
  }

  //-x
  else if(xPos < 0){
    vertex(xPos, yPos);
    endShape();

    xPos = canvas_x;
    yPos = force_num(yPos, force_y);

    beginShape(TRIANGLES);
  }
  
  //+x
  else if(xPos > canvas_x){
    vertex(xPos, yPos);
    endShape();

    xPos = 0;
    yPos = force_num(yPos, force_y);

    beginShape(TRIANGLES);
  }

  //-y
  else if(yPos < 0){
    vertex(xPos, yPos);
    endShape();

    yPos = canvas_y;
    xPos = force_num(xPos, force_x);

    beginShape(TRIANGLES);
  }
  
  //+y
  else if(yPos > canvas_y){
    vertex(xPos, yPos);
    endShape();

    yPos = 0;
    xPos = force_num(xPos, force_x);

    beginShape(TRIANGLES);
  }
  return [xPos, yPos];
}

function force_num(pos, force){
  if(force !== undefined){
    return force;
  }
  return pos;
}