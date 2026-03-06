'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 5;
const capture = false;
const capture_time = 50/fr;

const suggested_palettes = [];
function gui_values(){
  parameterize("margin_x", base_x/4, -base_x, base_x, 1, true);
  parameterize("margin_y", base_y/4, -base_y, base_y, 1, true);
}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************


function draw() {
  global_draw_start();
  push();
  background("WHITE")
  const weight = PITTPEN * global_scale;
  strokeWeight(weight);
  const nominal_step = 5 * weight;

  const c1 = color("ORANGE");
  const c2 = color("BLACK");
  const c3 = color("BLUE");
  c1.setAlpha(125);
  c2.setAlpha(125);
  c3.setAlpha(125);

  const total_x = canvas_x - margin_x;
  const total_y = canvas_y - margin_y;

  const pct_one_third = random(0.2, 0.4);
  const pct_two_third = pct_one_third + random(0.2, 0.4);

  stroke(c1);
  translate(margin_x/2, margin_y/2);
  let current_y = 0;
  while(current_y < total_y * pct_one_third){
    let step = lerp(nominal_step, 0, current_y/(total_y * pct_one_third));
    step = max(step, weight/4);
    current_y += step;
    line(0,current_y, total_x, current_y);
  }
  push();
  stroke(c2);
  translate(0, pct_one_third * total_y);
  let current_x = 0;
  let i =0;
  while(current_x <= total_x){
    line(current_x,0,current_x, (pct_two_third - pct_one_third)* total_y);
    const step = map(noise(i/5), 0,1, weight/4, weight);
    current_x += step;
    i++;
  }
  pop();
  push();
  stroke(c3);
  current_y = total_y * pct_two_third;
  while(current_y < total_y){
    let step = lerp(0, nominal_step, map(current_y/total_y, pct_two_third,1, 0, 1));
    step = max(step, weight/4);
    current_y += step;
    line(0,current_y, total_x, current_y);
  }
  pop();

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
