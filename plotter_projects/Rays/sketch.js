'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

let x_fourth, y_fourth, copic_palette;
const suggested_palettes = []

function gui_values(){
  parameterize("number_of_lines", floor(random(15,50)), 1, 100, 1, false);
  parameterize("sym_angs", floor(random(2,9)), 1, 8, 1, false);
  parameterize("lower_starting_x", 0, -500, 1500, 1, true);
  parameterize("lower_starting_y", canvas_y, -500, 1500, 1, true);
  parameterize("upper_starting_x", 0, -500, 1500, 1, true);
  parameterize("upper_starting_y", canvas_y/3, -500, 1500, 1, true);
  parameterize("lower_ending_x", 0, -500, 1500, 1, true);
  parameterize("lower_ending_y", canvas_y*2/3, -500, 1500, 1, true);
  parameterize("upper_ending_x", canvas_x, -500, 1500, 1, true);
  parameterize("upper_ending_y", canvas_y*2/3, -500, 1500, 1, true);
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
  
  while(sym_angs == 4) sym_angs = floor(random(2,9))//swastika check

  for(let j=0; j<sym_angs; j++){
    push();
    stroke(j*10);
    center_rotate(j*360/sym_angs);
    draw_rays();
    pop();
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
function draw_rays(){
  for(let i=0; i<=number_of_lines; i++){
    const lower_x = lerp(lower_starting_x, lower_ending_x, i/number_of_lines);
    const lower_y = lerp(lower_starting_y, lower_ending_y, i/number_of_lines);
    const upper_x = lerp(upper_starting_x, upper_ending_x, i/number_of_lines);
    const upper_y = lerp(upper_starting_y, upper_ending_y, i/number_of_lines);
    line(lower_x, lower_y, upper_x, upper_y);
  }
}