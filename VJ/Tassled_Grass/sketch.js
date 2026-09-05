'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 10;
const capture = false;
const capture_time = 5;

const suggested_palettes = [SOUTHWEST, BIRDSOFPARADISE, NURSERY];

let stalk_c, hair_array, hair_c, bg_c, wind_speed;

function gui_values(){
  parameterize("max_width", base_x, 0, base_x*2, 1, true);
  parameterize("max_height", base_y, 0, base_y *2, 1, true);
  parameterize("num_stalks", random(5,30), 1, 1000, 1, false);
  parameterize("max_noise_angle", random(50), 0, 180, 1, false); //small sin on this looks like swaying in the wind
  parameterize("noise_damp", random(1,15), 1, 100, 1, false);
  parameterize("stalk_segment_move", random(1, 5), 0, 10, 0.1, true);
  parameterize("max_hair_repeats", round(random(5,10)), 1, 20, 1, false);
  parameterize("max_hair_length", random(2,30), 0, 50, 0.1, true);
  parameterize("hair_start_pct", random(0.4,0.9), 0, 1, 0.01, false);
  parameterize("hair_move", random(0,5), 0, 20, 0.1, true);
  parameterize("hair_angle", random(50), 0, 180, 1, false);
  parameterize("hair_angle_offset", random(20), 0, 50, 0.1, false);
  parameterize("num_colors", floor(random(1,working_palette.length-1)), 1, working_palette.length-2, 1, false); //Corrected for the png_bg call
} 

//move all generating bits into separate functions that get called from setup
//move all drawing bits into draw
//decide what happens if gui changes, perhaps an event that callsback and regenerates the bits

function setup() {
  common_setup();
  gui_values();
  stalk_c = color(BIC_BLACK);
  stalk_c.setAlpha(BICCRISTAL_ALPHA);
  stroke(stalk_c);

  wind_speed = random(10,20);

  bg_c = png_bg(true);

  hair_array = [];
  working_palette = controlled_shuffle(working_palette, true);
  for(let i=0; i<num_colors; i++){
    const c = color(working_palette[i]);
    c.setAlpha(BICCRISTAL_ALPHA);
    hair_array.push(c);
  }

  strokeWeight(BICCRISTAL*global_scale);
  noFill();
}
//***************************************************
function draw() {
  global_draw_start();
  background(bg_c);
  for(let i=0; i<num_stalks; i++){
    let color_index = floor(noise(i) * hair_array.length);
    hair_c = hair_array[color_index];
    grass(i);
  }
  global_draw_end();
}
//***************************************************
//custom funcs

function grass(count, steps = 100){
  push();
  let direction = noise(count, 200); 
  if(direction <= 0.5) direction = -1;
  else direction = 1;
  const branch_width = map(noise(count, 100), 0,1, 0.1, 0.3) * max_width * direction;
  const branch_height = -max_height * map(noise(count, 300), 0,1, 0.1, 1.2);

  translate(map(noise(count, 400), 0,1, 0.4, 0.6) * width, height - branch_height * 0.05);

  let pct_start = 0;
  let pct_end = pct_start;
  let pct_min_step = 0.03;
  let pct_max_step = 0.15;
  while (pct_end < 1) {
    push();
    rotate(map(noise(count, pct_end/noise_damp), 0,1,-max_noise_angle,max_noise_angle));
    rotate(map(noise(count, pct_end/noise_damp, frameCount/10),0,1, -10, 10) * sin(frameCount*wind_speed));
    translate(stalk_segment_move * random(-1,1), stalk_segment_move * random(-1,1));
    pct_end = pct_start;
    const pct_add = random(pct_min_step, pct_max_step);
    pct_end = constrain(pct_end + pct_add, 0, 1);
    stalk(pct_start, pct_end, branch_width, branch_height, steps);
    pct_start = pct_end - random(0.75, 1) * pct_add;
    pop();
  }
  pop();
}

function easeInOutCubic(x, power=3) {
  //cubic easing function 0<=x<1 returns 0<=y<1
  if(x<0.5) return 4 * Math.pow(x, power);
  else return 1 - 4 * Math.pow(1 - x, power);
}

function stalk(start_pct, end_pct, w, h, steps) {
  const step_size = w / steps;

  const start_step = round(start_pct * steps);
  let end_step = round(end_pct * steps);
  if(end_step - start_step < 2) end_step = start_step + 2;

  let start_pt, end_pt;
  beginShape();
  for (let i = start_step; i < end_step; i++) {
    const x = i * step_size;
    const y = easeInOutCubic(abs(x / w)) * h;
    vertex(x, y);
  
    if(i == start_step) start_pt = {x: x, y:y};
    else if(i + 1 == end_step) end_pt = {x: x, y:y};
  }
  endShape();
  
  let hair_length = max_hair_length;
  if(end_pct < hair_start_pct) hair_length = 0;
  hairs(start_pt, end_pt, hair_length, lerp(0,max_hair_repeats, end_pct));
}

function hairs(pt1, pt2, hair_length, repeat = 2) {
  let p1 = createVector(pt1.x, pt1.y); // Start point
  let p2 = createVector(pt2.x, pt2.y); // End point

  let v = p5.Vector.sub(p2, p1);

  for(let i=0; i<repeat; i++){
    push();
    stroke(hair_c);
    translate(hair_move * random(-1,1), hair_move * random(-1,1));
    translate(p1.x, p1.y);
    rotate(v.heading());
    
    push();
    rotate(hair_angle + random(-hair_angle_offset,hair_angle_offset));
    if(hair_length != 0) line(0,0, hair_length, 0);
    pop();
    rotate(-hair_angle + random(-hair_angle_offset,hair_angle_offset));
    if(hair_length != 0) line(0,0, hair_length, 0);
    pop();
  }
}
