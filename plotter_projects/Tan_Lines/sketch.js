'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [BUMBLEBEE];

function gui_values(){
  parameterize("starting_rad", smaller_base/16, 0, smaller_base, 1, true);
  parameterize("ending_rad", smaller_base/2, 0, smaller_base * 2, 1, true);
  parameterize("num_lines", floor(random(8, 40)), 1, 100, 1, false);
  parameterize("num_pts", floor(random(50, 140)/400 * smaller_base), 1, 500, 1, false);
  parameterize("spacing_pct", 0.48, 0, 1, 0.01, false);
  parameterize("spacing_variance_pct", 0.1, 0, 1, 0.01, false);
  parameterize("lookahead_pct", random(-0.25, 0.5), -1, 1, 0.01, false);
  parameterize("line_damp", random(20, 200), 1, 250, 1, false);
} 

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();
  push();
  
  noFill();
  const weight = LEPEN * global_scale;
  strokeWeight(weight);
  const angle_step_size = 360/num_lines;

  const radius_step_size = (ending_rad - starting_rad)/num_pts;
  
  translate(canvas_x/2, canvas_y/2);

  let absolute_spacing;

  for(let i=0; i<num_lines; i++){
    beginShape();
    for(let j=0; j<num_pts; j++){
      push();

      const look_ahead = num_pts * lerp(0.1 * lookahead_pct, lookahead_pct, j/num_pts);
      const spacing = 0.5;

      const prev_pt = get_x_y((i-spacing), j + look_ahead, (i-spacing) * angle_step_size, radius_step_size, angle_step_size);
      const current_pt = get_x_y(i, j, i * angle_step_size, radius_step_size, angle_step_size);
      const next_pt = get_x_y((i+spacing), j + look_ahead, (i+spacing) * angle_step_size, radius_step_size, angle_step_size);

      const vec_prev_pt = createVector(prev_pt.x - current_pt.x, prev_pt.y - current_pt.y);
      const vec_next_pt = createVector(next_pt.x - current_pt.x, next_pt.y - current_pt.y);

      if(absolute_spacing == null){
        absolute_spacing = spacing_pct * vec_next_pt.mag()
      }

      let variance = random(1-spacing_variance_pct, 1+spacing_variance_pct);
      vec_prev_pt.setMag(vec_prev_pt.mag() - absolute_spacing * variance);
      variance = random(1-spacing_variance_pct, 1+spacing_variance_pct);
      vec_next_pt.setMag(vec_next_pt.mag() - absolute_spacing * variance);

      translate(current_pt.x, current_pt.y);
      stroke("BLACK")
      line(0,0, vec_prev_pt.x, vec_prev_pt.y);
      line(0,0, vec_next_pt.x, vec_next_pt.y);
      vertex(current_pt.x,current_pt.y);
      pop();
    }
    stroke("GOLD")
    endShape();
  }

  //at each n points, look ahead  to next line's theta to guage spacing
  

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
function get_x_y(i, j, theta, radius_step_size, angle_step_size){
    const radius = j * radius_step_size + starting_rad;
    let xoff = map(cos(theta),-1,1,0,1);
    let yoff = map(sin(theta),-1,1,0,1);
    const actual_theta = theta + map(noise(xoff, yoff, j/line_damp), 0,1, -angle_step_size, angle_step_size);
    const x = radius * cos(actual_theta);
    const y = radius * sin(actual_theta);
    return {x:x, y:y};
}