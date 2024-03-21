'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 30;
const capture = false;
const capture_time = 15;

const suggested_palettes = [];

function gui_values(){
  parameterize("weight", 0.5, 0, 2, 0.01, true);
  parameterize("max_num_pts_per_circle", 500, 1, 500, 1, false);
  parameterize("num_rings", 100, 1, 400, 1, false);
  parameterize("cols", 4, 1, 10, 1, false);
  parameterize("rows", 2, 1, 10, 1, false);
}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  strokeWeight(weight);

  const col_step = canvas_x/cols;
  const row_step = canvas_y/rows;
  let c = 0;
  for(let i=0; i<cols; i++){
    for(let j=0; j<rows; j++){
      push();
      stroke(c);
      const actual_x = (i+1) * col_step - col_step/2;
      const actual_y = (j+1) * row_step - row_step/2;
      let vec = createVector(canvas_x/2 - actual_x, canvas_y/2 - actual_y);
      translate(actual_x, actual_y);
      translate(random(-col_step/8, col_step/8), random(-row_step/8, row_step/8));
      rotate(vec.heading());
      pointed_cone();

      c += 10;
      pop();
    }
  }

  pop();
  
  global_draw_end();
}
//***************************************************
//custom funcs
function pointed_cone(){
  for(let i=0; i<num_rings; i++){
    const radius = i * weight;
    const num_pts_per_circle = floor(lerp(1, max_num_pts_per_circle, i/num_rings));
    const theta_step = 360/num_pts_per_circle;

    for(let j=0; j<num_pts_per_circle; j++){
      const theta = j * theta_step;
      let pt_chance;
      if(theta < 180) pt_chance = map(theta, 45, 180, 0, 1);
      else pt_chance = map(theta, 180, 315, 1, 0);
      if(random() > pt_chance) continue;

      const x = radius * cos(theta);
      const y = radius * sin(theta);

      line(x, y, x+0.1, y+0.1);
    }
  }
}