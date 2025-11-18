'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 5;
const capture = false;
const capture_time = 50/fr;

const suggested_palettes = [];
let weight, bg_c;

function gui_values(){
  parameterize("num_rings", floor(random(40,100)), 1, 200, 1, false);
}

function setup() {
  common_setup();
  gui_values();
  noLoop();
  strokeCap(SQUARE);
  noFill();
  ellipseMode(RADIUS);
  weight = LEPEN * global_scale;
  strokeWeight(weight);
  bg_c = color("RED");
}
//***************************************************
function draw() {
  global_draw_start();
  push();
  const outer_radius = sqrt(pow(width,2) + pow(height,2));
  const starting_radius = 10;
  translate(width/2, height/2);
  const ring_gap = 0.25 * outer_radius/num_rings;
  const ring_thickness = (outer_radius - starting_radius)/num_rings;
  const line_steps = floor(ring_thickness/(weight/2));
  for(let i=0; i<num_rings; i++){
    let starting_x = starting_radius + i * ((outer_radius - starting_radius)/num_rings + ring_gap);
    if(random()>0.5) starting_x -= ring_gap;
    rotate(noise(i/1000)*360);
    const starting_angle = map(noise(i/1000), 0,1, 20, 45);
    //calculate gap angle so that we end up with a whole number of "num_blocks" 
    const gap_angle = 360/(ceil(360/starting_angle) - random([1,2,3])) - starting_angle;
    
    simple_block(starting_angle, gap_angle, starting_x, line_steps);
    if(random()>0.8){
     circle_cutout(starting_x + ring_thickness/2 - weight/2,0, starting_angle/2, starting_angle + gap_angle, ring_thickness/2);
    }
    else if(random()>0.5){
      edge_arc_cutout(starting_x + ring_thickness/2 - weight/2,0, starting_angle, gap_angle, ring_thickness/2, "left");
      if(random()>0.5){
        edge_arc_cutout(starting_x + ring_thickness/2 - weight/2,0, starting_angle, gap_angle, ring_thickness/2, "right");
      }
    }
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
function simple_block(sweep, gap, r, line_steps){
  const angle_step = sweep + gap;
  const num_blocks = 360/angle_step;
  for(let i=0; i<num_blocks; i++){
    push();
    rotate(i * angle_step);
    for(let j=0; j<line_steps; j++){
      const current_rad = r + j * weight/2;
      arc(0,0, current_rad,current_rad, 0, sweep);
    }
    pop();
  }
}

function circle_cutout(x, y, start_ang, step_ang, d){
  if(step_ang == 0) return;
  push();
  fill(bg_c);
  stroke(bg_c);

  const num_blocks = 360/step_ang;
  for(let i=0; i<num_blocks; i++){
    push();
    rotate(start_ang + i * step_ang);
    circle(x,y, d);
    pop();
  }
  pop();
}

function edge_arc_cutout(x, y, sweep, gap, d, left_right="left"){
  if(sweep == 0 || gap == 0) return;
  const angle_step = sweep + gap;
  const num_blocks = 360/angle_step;
  let start = 0;
  let end = 180;
  if(left_right == "right"){
    start = 180;
    end = 360;
  }
  
  push();
  fill(bg_c);
  stroke(bg_c);
  for(let i=0; i<num_blocks; i++){
    push();
    rotate(i * angle_step-1);
    if(left_right == "right") rotate(sweep + 2);
    arc(x,y, d, d, start, end, PIE);
    pop();
  }
  pop();
}
