'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 8;


function gui_values(){
  parameterize("starting_radius", canvas_x/2, canvas_x/4, canvas_x, 5, false);
  parameterize("num_rings", floor(random(2,8)), 1, 10, 1, false);
  parameterize("num_lines", round(random(100,300)), 1, 300, 1, false);
  parameterize("rand_colors", random([0,1]), 0,1,1,false);
}

function setup() {
  common_setup();
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();
  //actual drawing stuff
  push();
  translate(canvas_x/2, canvas_y/2);
  let bg_c = random(working_palette);
  reduce_array(working_palette, bg_c);
  if(type == "png") background(random(working_palette));

  rotate(random([0, 45, 90, 135, 180, 225, 270, 315]));
  let radius = starting_radius;
  let ring_rad = starting_radius / random([num_rings,num_rings+1]);
  const nominal_theta_step = 360 / num_lines;
  let theta = 0;
  const rot_choice = round(random());
  for(let i=0; i<num_rings; i++){
    if(rot_choice) rotate(random(360));
    else rotate(180);
    let offset_theta = random([-1, 0, 1]) * random(30);
    if(random()>0.5) offset_theta = 0;
    for(let j=0; j<num_lines*2; j++){
      if(rand_colors) stroke(random(working_palette));
      if(j/num_lines > 1) theta += lerp(nominal_theta_step, 0, j/num_lines);
      else theta += lerp(0, nominal_theta_step, map(j/num_lines, 1, 2, 0,1));
      let start_x = radius * cos(theta);
      let start_y = radius * sin(theta);
      let end_theta = theta;
      end_theta += offset_theta;
      let end_x = (radius - ring_rad) * cos(end_theta);
      let end_y = (radius - ring_rad) * sin(end_theta);
      line(start_x, start_y, end_x, end_y);
    }
    radius -= ring_rad;
  }

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs


