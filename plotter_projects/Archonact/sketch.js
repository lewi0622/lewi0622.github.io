'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

function gui_values(){
  parameterize("thickness", 3, 1, 10, 1, false);
  parameterize("angle_steps", 90, 1, 360, 1, false);
  parameterize("radius", 15, 1, smaller_base, 1, true);
  parameterize("min_steps", 50, 1, 200, 1, false);
  parameterize("max_steps", 300, 1, 500, 1, false);
  parameterize("step_size", 2, 1, 10, 0.1, true);
  parameterize("post_rotation", 0, 0, 360, 1, false);
  parameterize("sq_rotation", 0, 0, 360, 1, false);
} 

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();
  push();
  png_bg(false, color("WHITE"));
  strokeWeight(LEPEN * global_scale);
  noFill();
  const angle_step_size = 360 / angle_steps;
  translate(width/2, height/2);
  rotate(random(360));
  translate(-width/4, -height/4);
  rotate(post_rotation);

  const angle_snap = random(360);
  
  for(let i=0; i<angle_steps; i++){
    for(let j=0; j<thickness; j++){
      const theta = j + i * angle_step_size;
      const x = radius * cos(theta);
      const y = radius * sin(theta);
      const shape_info = smear(x,y, i, );
    }
  }
  rectMode(CENTER);  
  stroke("RED");
  fill("RED");
  rotate(sq_rotation);
  square(0,0, radius*2);

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
function smear(x, y, noise_offset = random(100), steps = floor(random(min_steps, max_steps))){
  
  let shape_info;
  beginShape();
  for(let i=0; i<steps; i++){
    const theta = map(noise((i+noise_offset)/100), 0,1, -180, 180);
    x += step_size * cos(theta);
    y += step_size * sin(theta);
    vertex(x,y);
    if(i+1 == steps){
      shape_info = {
        x:x,
        y:y,
        theta: theta
      }
    }
  }
  endShape();
  
  return shape_info;
}