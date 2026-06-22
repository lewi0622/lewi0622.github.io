'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [SIXTIES];

function gui_values(){
  parameterize("num_rays", floor(random(200, 600)), 0, 1000, 1, false);
  parameterize("theta_off_amt", random(5), 0, 45, 1, false);
  parameterize("outer_radius", smaller_base/random(4,15), 0, smaller_base/2, 1, true);
  parameterize("pct_w", random(0.3,0.5), 0, 1, 0.01, false);
  parameterize("pct_h", random(0.3,0.5), 0, 1, 0.01, false);
  parameterize("offset_w", random(-0.25, 0.25), -1, 1, 0.01, false);
  parameterize("offset_h", random(-0.25, 0.25), -1, 1, 0.01, false);
} 

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();
  push();
  png_bg(true);
  const c1 = random(working_palette);
  reduce_array(working_palette, c1);
  const c2 = random(working_palette);

  translate(canvas_x/2, canvas_y/2);
  clip(mask);
  push();
  translate(base_x * offset_w, base_y * offset_h);
  const angle_step = 360/num_rays;
  const strip_start = random(30,150);
  const strip_width = random(5, 45);
  let offset;
  for(let i=0; i<num_rays; i++){
    const theta = i * angle_step;
    const starting_pt = {
      x:outer_radius * cos(theta),
      y:outer_radius * sin(theta)
    };
    
    const theta_offset = random(-theta_off_amt, theta_off_amt);
    const ending_radius = max(width, height);
    const ending_pt = {
      x: ending_radius * cos(theta + theta_offset),
      y: ending_radius * sin(theta + theta_offset)
    };
    stroke(c1);
    offset = draw_ray(starting_pt, ending_pt);
  }
  fill(c2)
  circle(0,0, outer_radius*2);

  pop();
  stroke(c1);
  strokeWeight(10);
  mask();

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
function mask(w=canvas_x * pct_w, h=canvas_y * pct_h){
  noFill();
  beginShape();
  vertex(w, 0);
  vertex(0, h);
  vertex(-w, 0);
  vertex(0, -h);
  endShape(CLOSE);
}

function draw_ray(start, end, step_size = 20, wobble_amp = 300){
  //change to use step size rather than lerp and calc the pts needed to do random lengthed rays
  push();
  noFill();
  let wobble_0 = {};
  const pts = floor(dist(start.x, start.y, end.x, end.y)/step_size);
  beginShape();
  for(let i=0; i<pts; i++){
    const x = lerp(start.x, end.x, i/pts);
    const y = lerp(start.y, end.y, i/pts);
    
    let wobble_x = map(noise(i/100), 0,1, -wobble_amp,wobble_amp);
    let wobble_y = map(noise(100 + i/100), 0,1, -wobble_amp,wobble_amp);
    
    if(i == 0){
      wobble_0.x = wobble_x;
      wobble_0.y = wobble_y;
      translate(-wobble_0.x, -wobble_0.y);
    }
    
    if(random()>1 && i/pts > 0){
      endShape();
      beginShape();
    }else vertex(x + wobble_x, y + wobble_y);

  }
  endShape();
  pop();
  
  return wobble_0;
}