'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

let num_pts;
let pts;

function gui_values(){

} 

//TODO move stuff into params

function setup() {
  common_setup();
  gui_values();

  pts = [];
  num_pts = floor(random(50, 1000));
  for(let i=0; i<num_pts; i++){
    const obj = {}
    obj.x = random(-canvas_x/2, canvas_x*1.5);
    obj.y = random(-canvas_y/2, canvas_y*1.5);
    obj.len = random(5,40)*global_scale;
    obj.speed = random(5,40)*global_scale;
    pts.push(obj);
  }

  document.body.style.background = "BLACK";
  pixelDensity(2);
}
//***************************************************
function draw() {
  global_draw_start();

  push();
  const c = color("WHITE");
  stroke(c);

  const [xoff, yoff] = noise_loop_2d(fr, capture_time, 0.5);
  
  translate(canvas_x/2, canvas_y/2);
  rotate(map(pnoise.simplex2(xoff, yoff), -1,1, -360, 360));

  translate(-canvas_x/2, -canvas_y/2);
  
  for(let i=0; i<num_pts; i++){
    const pt = pts[i];
    line(pt.x, pt.y, pt.x+pt.len, pt.y);
  }
  
  const c1 = color("WHITE");
  const c2 = color("WHITE");
  c2.setAlpha(0);
  line_blur(c1, 20*global_scale);
  set_linear_gradient([c1,c2], 0, 0, canvas_x, 0, "fill");
  translate(canvas_x/2, canvas_y/2);

  const theta = angle_loop(fr, capture_time, floor(capture_time/2));

  const tri_width =  map(sin(theta), -1,1, 2,20)*global_scale;

  triangle(0,-tri_width, 0, tri_width, canvas_x, 0);
  triangle(0,-tri_width, 0, tri_width, canvas_x, 0);

  fill(c1);

  circle(0,0,tri_width * 2);
  circle(0,0,tri_width * 2);
  
  move_pts();
  pop();

  global_draw_end();
}
//***************************************************
//custom funcs
function move_pts(){
  for(let i=0; i<num_pts; i++){
    const pt = pts[i];
    pt.x += pt.speed;
    if(pt.x > canvas_x * 1.5) pt.x = -canvas_x/2;
  }
}