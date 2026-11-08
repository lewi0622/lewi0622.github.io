'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 50/fr;

const suggested_palettes = [];
let path = [];
function gui_values(){

}

function setup() {
  common_setup();
  gui_values();
  noFill();
  const c = color(BIC_RED);
  c.setAlpha(BICCRISTAL_ALPHA);
  stroke(c);
  path = generate_path();
  loop();
}
//***************************************************
function draw() {
  global_draw_start(false);
  push();
  center_path(path);
  draw_path(mutate_path(path));
  if(my_frameCount > 100) noLoop();
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
function generate_path(num_steps = 10, step_size = 50*global_scale, i_damp = 1, second_dim_seed = random(100)){
  //pick random starting point
  let current_pt = {
    x: random(width),
    y: random(height)
  };
  //meander for number of steps
  const pts = [];
  for(let i=0; i<num_steps; i++){
    const theta = map(noise(i/i_damp, second_dim_seed), 0,1, -180, 180);
    current_pt.x = current_pt.x + step_size * cos(theta);
    current_pt.y = current_pt.y + step_size * sin(theta);
    pts.push({ ...current_pt});
  }
  return pts;
}

function center_path(pts){
  let min_x = width;
  let max_x = 0;
  let min_y = height; 
  let max_y = 0;
  for(let i=0; i<pts.length; i++){
    const x = pts[i].x;
    const y = pts[i].y;
    if(x < min_x) min_x = x;
    if(x > max_x) max_x = x;
    if(y < min_y) min_y = y;
    if(y > max_y) max_y = y;
  }
  const offset_x = (width - max_x-min_x)/2;
  const offset_y = (height - max_y-min_y)/2;
  translate(offset_x, offset_y);
}


function draw_path(pts){
  push();
  beginShape();
  for(let i=0; i<pts.length; i++){
    splineVertex(pts[i].x, pts[i].y);
  }
  endShape();
  pop();
}

function mutate_path(pts, max_move = 10 * global_scale){
  const mutated_path = structuredClone(pts);
  for(let i=0; i<mutated_path.length; i++){
    if(i==0 || i+1 == mutated_path.length) continue;
    mutated_path[i] = {
      x: mutated_path[i].x + random(-max_move, max_move),
      y: mutated_path[i].y + random(-max_move, max_move)
    };
  }
  return mutated_path;
}

