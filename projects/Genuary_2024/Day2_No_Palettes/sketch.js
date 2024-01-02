'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 10;

suggested_palettes = []

let theta = 0;

function gui_values(){
  const variations = [[3.7,50], [1,round(random(50,100))], [1,100], [9.9, 100]];
  const variation = random(variations);
  parameterize("theta_inc", variation[0], 0.1, 10, 0.1, false);
  parameterize("lines_per_frame", variation[1], 1, 100, 1, false);
}

function setup() {
  common_setup();
  background("WHITE");
  colorMode(HSB,100);
  strokeCap(ROUND);
}
//***************************************************
function draw() {
  global_draw_start(false);

  //actual drawing stuff
  push();
  const weight = map(sin(theta/50), -1,1, 2, 15)*global_scale;
  strokeWeight(weight);
  for(let i=0; i<lines_per_frame; i++){
    push();
    if(i%2==0) blendMode(MULTIPLY);
    const max_radius = map(sin(theta/20), -1,1, 300, 400)*global_scale;
    const radius = random(max_radius*0.9,max_radius);
    translate(canvas_x/2, canvas_y/2);
    rotate(theta);
    //color
    const h = map(radius, 300*global_scale, 400*global_scale, 0, 100);
    stroke(h, random(100), random(100), random(100));
    line(0,0, radius, 0);
    
    theta += theta_inc;
    pop();
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
