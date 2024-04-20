'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

let x_fourth, y_fourth, copic_palette;
const suggested_palettes = [BEACHDAY, BUMBLEBEE, BIRDSOFPARADISE];

function gui_values(){
  parameterize("circle_segments", 1000, 3, 5000, 1, false);
  parameterize("circle_radius", smaller_base/random(4,8), 1, smaller_base * 2, 1, true);
  parameterize("min_line_length", 10, 1, 1000, 1, true);
  parameterize("max_line_length", 120, 1, 1000, 1, true);
  parameterize("ang", random([0,random(180)]), 0, 180, 1, false);
  parameterize("x_noise_damp", random(50,1000), 1, 1000,1, true);
  parameterize("y_noise_damp", random(50,1000), 1, 1000,1, true);
  parameterize("num_colors", round(random(2, working_palette.length-1)), 2, working_palette.length-1, 1, false);
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
  strokeWeight(1*global_scale);
  working_palette = controlled_shuffle(working_palette, true);
  png_bg(true);
  const circle_step = 360/num_colors;
  const rotations = [];
  const colors = [];
  for(let i=0; i<num_colors; i++){
    rotations.push(random(-ang, ang) + i * circle_step);

    colors.push(color(working_palette[i]));
    colors[i].setAlpha(200);
  }
  translate(canvas_x/2, canvas_y/2);
  noFill();

  for(let i=0; i<circle_segments; i++){
    push();
    const theta = 360/circle_segments*i;
    const x = circle_radius * cos(theta);
    const y = circle_radius * sin(theta);
    translate(x,y);
    const line_length = map(noise(x/x_noise_damp,y/y_noise_damp),0,1, min_line_length,max_line_length);
    const id = colors.indexOf(random(colors));
    rotate(rotations[id]);
    stroke(colors[id]);
    line_blur(colors[id], 2*global_scale);
    line(0,0, line_length, 0);
    pop();
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
