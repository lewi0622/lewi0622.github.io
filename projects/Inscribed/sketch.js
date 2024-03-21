'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
let capture = false;
const capture_delay = false & capture;
const capture_delay_seconds = 10;
let capture_time = 10;
if(capture_delay) capture_time += capture_delay_seconds;

const suggested_palettes = [BEACHDAY, SUMMERTIME, SOUTHWEST];

let pts, c, new_c, old_c, color_count;

function gui_values(){
  parameterize("max_pts", floor(random(4,100)), 2, 200, 1, false);
  parameterize("min_speed", random(0.01, 2), 0.01, 10, 0.01, true);
  parameterize("max_speed", random(10,20), 0.01, 20, 0.01, true);
}

function setup() {
  common_setup();
  gui_values();
  pts = [];
  //init colors
  c = color(random(working_palette));
  new_c = c;
  old_c = c;
  color_count = 0;
  noFill();
  strokeJoin(ROUND);
  drawingContext.filter = "brightness(150%)";
}
//***************************************************
function draw() {
  if(capture_delay) capture = frameCount>capture_delay_seconds*fr;
  global_draw_start();

  push();
  center_rotate(map(sin(frameCount*0.75), -1,1, -360,360));
  background("BLACK");

  let weight = map(noise(frameCount/10), 0,1, 5,12)*global_scale;
  strokeWeight(map(sin(frameCount*10), -1,1, weight,weight*1.5));

  let color_frame_count = 40;
  if(frameCount%color_frame_count==0){
    color_count = 0;
    old_c = new_c;
    new_c = color(random(working_palette));
  }
  c = lerpColor(old_c, new_c, color_count*color_frame_count/1000);
  color_count++;
  drawingContext.shadowBlur=map(sin(frameCount*10), -1,1, 2,5)*global_scale;
  drawingContext.shadowColor = c;

  stroke(c);

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
      if(pt.y < pta.y){
        pts[i].y = pta.y;
        pts[i].dest = "b";
        pts[i].speed = random(min_speed, max_speed);//to_remove.push(i);// hit point a, delete pt
      }
      else pts[i].y = pt.y; //continue towards d
    }
  }

  // for(let i=to_remove.length-1; i>=0; i--){
  //   pts.splice(to_remove[i],1);
  // }

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
    push();
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
    pop();
  }

  square(0,0,canvas_x/2);
    
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs




