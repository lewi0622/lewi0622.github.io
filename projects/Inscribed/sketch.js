'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
let capture = false;
const capture_delay = false & capture;
const capture_delay_seconds = 10;
const capture_time = 10 + capture_delay_seconds;

suggested_palettes = [BEACHDAY, SUMMERTIME, SOUTHWEST];

let pts, c;

function gui_values(){
  parameterize("max_pts", 35, 2, 100, 1, false);
  parameterize("min_speed", 1.5, 0.01, 10, 0.01, true);
  parameterize("max_speed", 10, 0.01, 20, 0.01, true);
}

function setup() {
  common_setup();
  pts = [];
  c = color(random(working_palette));
  strokeJoin(ROUND);
}
//***************************************************
function draw() {
  if(capture_delay) capture = frameCount>capture_delay_seconds*fr;
  global_draw_start();

  push();
  center_rotate(frameCount/2);
  // blendMode(DIFFERENCE);
  background("BLACK");
  noFill();
  let weight = 5*global_scale;
  strokeWeight(weight);

  if(frameCount%10==0) c = color(random(working_palette));
  drawingContext.shadowBlur=map(sin(frameCount*10), -1,1, 2,5)*global_scale;
  drawingContext.shadowColor = c;
  drawingContext.filter = "brightness(200%)";
  stroke(c);
  curveTightness(sin(frameCount)*5);

  translate(canvas_x/4, canvas_y/4);
  const pta = {x:0, y:0};
  const ptb = {x:canvas_x/2, y:0};
  const ptc = {x:canvas_x/2, y:canvas_y/2};
  const ptd = {x:0, y:canvas_y/2};

  const to_remove = [];

  //move points, a-b, b-c, c-d, d-a
  for(let i=0; i<pts.length; i++){
    const pt = pts[i];
    if(pt.dest == "b"){
      pt.x += pt.speed;
      if(pt.x > ptb.x){ // hit point b, turn to c
        pts[i].x = ptb.x;
        pts[i].dest = "c";
      }
      else pts[i].x = pt.x; //continue towards b
    }
    else if(pt.dest == "c"){
      pt.y += pt.speed;
      if(pt.y > ptc.y){ // hit point c, turn to d
        pts[i].y = ptc.y;
        pts[i].dest = "d";
      }
      else pts[i].y = pt.y; //continue towards c
    }
    else if(pt.dest == "d"){
      pt.x -= pt.speed;
      if(pt.x < ptd.x){ // hit point d, turn to a
        pts[i].x = ptd.x;
        pts[i].dest = "a";
      }
      else pts[i].x = pt.x; //continue towards d
    }
    else if(pt.dest == "a"){
      pt.y -= pt.speed;
      if(pt.y < pta.y) to_remove.push(i);// hit point a, delete pt
      else pts[i].y = pt.y; //continue towards d
    }
  }

  for(let i=to_remove.length-1; i>=0; i--){
    pts.splice(to_remove[i],1);
  }

  //create new pt if less than max
  if(pts.length<max_pts){
    const new_pt = {
      x:0, 
      y:0, 
      speed: random(min_speed, max_speed), 
      dest:"b",
    };
    const new_id = floor(random(pts.length));
    // pts.splice(new_id, 0, new_pt);
    pts.push(new_pt);
  }

  //draw points
  let line_iterations = 3;
  for(let j=0; j<line_iterations; j++){
    if(j+1==line_iterations){
      drawingContext.shadowBlur=0;
      drawingContext.filter = "brightness(100%)";
      stroke("BLACK");
      strokeWeight(map(sin(frameCount*10), -1,1, weight*0.5,weight*0.75));
    }
    beginShape();
    for(let i=0; i<pts.length; i++){
      vertex(pts[i].x, pts[i].y);
    }
    endShape(CLOSE);
  }

    
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs




