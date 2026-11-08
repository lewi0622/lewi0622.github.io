'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

let line_collection, pts;

const suggested_palettes = [SAGEANDCITRUS, COTTONCANDY, MUTEDEARTH]


function gui_values(){

}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();

  const num_pts = 1000;
  let xPos = 0;
  let yPos = canvas_y/2;

  //apply background
  random([bg_vertical_strips, bg_horizontal_strips])(random([2,3,4]));

  //actual drawing stuff
  push();
  center_rotate(random([0, 180]));

  strokeCap(SQUARE);
  strokeWeight(30*global_scale)
  noFill();

  line_collection = []
  pts = [];
  for(let i=0; i<num_pts; i++){
    pts.push({x:xPos, y:yPos});

    //move
    xPos += random(-5,10)*global_scale;
    yPos += random(-4,4)*global_scale;

    //check for wrapping
    const pos = wrap(undefined, canvas_y/2, xPos, yPos);
    xPos = pos[0];
    yPos = pos[1];
  }

  line_collection.push(pts);

  for(let i=0; i<line_collection.length; i++){
    if(line_collection[i].length < 3) continue;

    let num_pts = line_collection[i].length;
    num_pts = floor(num_pts/3)*3;

    beginShape(TRIANGLES);
    for(let j=0; j<num_pts; j++){
      stroke(random(working_palette));
      const pt = line_collection[i][j];
      vertex(pt.x, pt.y);
      if((j+1)%3 == 0){
        endShape();
        beginShape(TRIANGLES);
      }
    }
    endShape();
  }
  
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
function wrap(force_x, force_y, xPos, yPos){
  //-x, -y
  if(xPos < 0 && yPos < 0){
    pts.push({x:xPos, y:yPos});
    line_collection.push(pts);

    xPos = canvas_x;
    yPos = canvas_y;
    xPos = force_num(xPos, force_x);
    yPos = force_num(yPos, force_y);

    pts = [];
  }

  //-x, +y
  else if(xPos < 0 && yPos > canvas_y){
    pts.push({x:xPos, y:yPos});
    line_collection.push(pts);
    
    xPos = canvas_x;
    yPos = 0;
    xPos = force_num(xPos, force_x);
    yPos = force_num(yPos, force_y);
    
    pts = [];
  }

  //+x, +y
  else if(xPos > canvas_x && yPos > canvas_y){
    pts.push({x:xPos, y:yPos});
    line_collection.push(pts);
    
    xPos = 0;
    yPos = 0;
    xPos = force_num(xPos, force_x);
    yPos = force_num(yPos, force_y);
    
    pts = [];
  }

  //+x, -y
  else if(xPos > canvas_x && yPos < 0){
    pts.push({x:xPos, y:yPos});
    line_collection.push(pts);
    
    xPos = 0;
    yPos = canvas_y;
    xPos = force_num(xPos, force_x);
    yPos = force_num(yPos, force_y);
    
    pts = [];
  }

  //-x
  else if(xPos < 0){
    pts.push({x:xPos, y:yPos});
    line_collection.push(pts);

    xPos = canvas_x;
    yPos = force_num(yPos, force_y);

    pts = [];
  }
  
  //+x
  else if(xPos > canvas_x){
    pts.push({x:xPos, y:yPos});
    line_collection.push(pts);

    xPos = 0;
    yPos = force_num(yPos, force_y);

    pts = [];
  }

  //-y
  else if(yPos < 0){
    pts.push({x:xPos, y:yPos});
    line_collection.push(pts);

    yPos = canvas_y;
    xPos = force_num(xPos, force_x);

    pts = [];
  }
  
  //+y
  else if(yPos > canvas_y){
    pts.push({x:xPos, y:yPos});
    line_collection.push(pts);f

    yPos = 0;
    xPos = force_num(xPos, force_x);

    pts = [];
  }
  return [xPos, yPos];
}

function force_num(pos, force){
  if(force !== undefined){
    return force;
  }
  return pos;
}