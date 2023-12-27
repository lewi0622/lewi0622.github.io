'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 8;


function gui_values(){
  parameterize("num_sides", floor(random(3,7)), 3, 20, 1, false);
  parameterize("num_swirls", 100, 1, 500, 1, false);
  parameterize("starting_radius", canvas_x/2, canvas_x/4, canvas_x, 1, false);
  parameterize("min_radius_dec", 0.5, 0.1, 5, 0.1, true);
  parameterize("max_radius_dec", 0.5, 0.1, 5, 0.1, true);
  parameterize("rot_reset", 40, 0, 200, 1, false);
  parameterize("max_rot", 0.7, 0, 1, 0.01, false);
  parameterize("tightness", 0.5, -5, 5, 0.1, false);
}

function setup() {
  common_setup();
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  translate(canvas_x/2, canvas_y/2);
  curveTightness(tightness);
  const num_pts = num_sides * num_swirls;
  const ang_step = 360/num_sides;
  let rad = starting_radius;
  let rotation = 0; 
  let rotation_amt = 0;
  let radius_dec = random(min_radius_dec, max_radius_dec);
  beginShape();
  //tuck
  // curveVertex(rad-radius_dec*5,0);
  

  for(let i=0; i<num_pts; i++){
    if(i%rot_reset == 0){
      rotation_amt = random(-max_rot, max_rot);
      // rotation = 0;
      // radius_dec = random(min_radius_dec, max_radius_dec);
    }
    const theta = ang_step*i + rotation;
    let x = rad * cos(theta);
    let y = rad * sin(theta);
    curveVertex(x,y);
    rad -= radius_dec;
    rotation += rotation_amt;
    if(rad <= 0) break;
  }
  endShape();

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs


