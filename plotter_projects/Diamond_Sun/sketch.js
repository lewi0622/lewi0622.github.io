'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [BUMBLEBEE, SUMMERTIME, SOUTHWEST, MUTEDEARTH, SUPPERWARE, SIXTIES];
let weight, c1, c2;

function gui_values(){
  parameterize("num_rays", floor(random(200, 600)), 0, 1000, 1, false);
  parameterize("theta_off_amt", random(5), 0, 10, 0.1, false);
  parameterize("outer_radius", smaller_base/random(6,15), 0, smaller_base/2, 1, true);
  parameterize("pct_w", random(0.3,0.5), 0, 1, 0.01, false);
  parameterize("pct_h", random(0.3,0.5), 0, 1, 0.01, false);
  parameterize("offset_w", random(-0.35, 0.35), -1, 1, 0.01, false);
  parameterize("offset_h", random(-0.35, 0.35), -1, 1, 0.01, false);
  parameterize("wobble_amp", smaller_base * random(0.25, 1.5), 0, 1000, 1, true);
  parameterize("step_size", smaller_base / random(8,40), 5, 50, 1, true);
} 

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();
  weight = LEPEN * global_scale;
  strokeWeight(weight);

  push();
  png_bg(true);
  c1 = random(working_palette);
  reduce_array(working_palette, c1);
  c2 = random(working_palette);

  translate(canvas_x/2, canvas_y/2);
  if(type == "png") clip(mask);
  push();
  translate(canvas_x * offset_w, canvas_y * offset_h);
  const angle_step = 360/num_rays;
  for(let i=0; i<num_rays; i++){
    const theta = i * angle_step;
    const starting_pt = {
      x:outer_radius * cos(theta),
      y:outer_radius * sin(theta)
    };
    
    const theta_offset = random(-theta_off_amt, theta_off_amt);
    const ending_radius = max(canvas_x, canvas_y)*1.5;
    const ending_pt = {
      x: ending_radius * cos(theta + theta_offset),
      y: ending_radius * sin(theta + theta_offset)
    };
    stroke(c1);
    draw_ray(starting_pt, ending_pt);
  }
  fill(c2)
  circle(0,0, outer_radius*2);

  pop();
  stroke(c1);
  let outline_weight = 10*global_scale;
  if(type == "png") strokeWeight(outline_weight);
  mask(outline_weight);-

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
function mask(outline_weight = 1*global_scale, w=canvas_x * pct_w, h=canvas_y * pct_h){
  noFill();
  let iterations = 1;
  if(type == "svg"){
    iterations = ceil(outline_weight / weight);
    stroke(c2);
  }
  for(let i=iterations; i>=0; i--){
    stroke(c2);
    if(i==iterations && type == "svg") stroke("GREEN");
  
    const inc = i * weight;
    beginShape();
    vertex(w -inc, 0);
    vertex(0, h-inc);
    vertex(-w+inc, 0);
    vertex(0, -h+inc);
    endShape(CLOSE);
  }
}

function draw_ray(start, end){
  //change to use step size rather than lerp and calc the pts needed to do random lengthed rays
  push();
  noFill();
  const pts = floor(dist(start.x, start.y, end.x, end.y)/step_size);
  beginShape();
  for(let i=0; i<pts; i++){
    const x = lerp(start.x, end.x, i/pts);
    const y = lerp(start.y, end.y, i/pts);
    
    let wobble_x = map(noise(i/100), 0,1, -wobble_amp,wobble_amp);
    let wobble_y = map(noise(100 + i/100), 0,1, -wobble_amp,wobble_amp);
    
    if(i == 0) translate(-wobble_x, -wobble_y);
    
    if(random()>1 && i/pts > 0){
      endShape();
      beginShape();
    } else vertex(x + wobble_x, y + wobble_y);

  }
  endShape();
  pop();
}