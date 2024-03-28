'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [SOUTHWEST, MUTEDEARTH, SIXTIES];

function gui_values(){
  parameterize("margin_x", 0, -base_x/2, base_x/2, 1, true);
  parameterize("margin_y", 0, -base_y/2, base_y/2, 1, true);
  parameterize("circles_per_row", floor(random(10,50)), 1, 100, 1, false);
  parameterize("circles_per_column", floor(random(10,50)), 1, 100, 1, false);
  parameterize("circle_size", smaller_base/random(8,32), 0, smaller_base/4, 1, true);
  parameterize("ring_skip", 0.1, 0, 1, 0.05, false);
  parameterize("ring_step_size", circle_size/80, circle_size/1100, circle_size/5.5, circle_size/1100, true);
  parameterize("circle_skip", 0.1, 0, 1, 0.05, false);
  parameterize("x_damp", 10, 0.01, 1000, 0.1, false);
  parameterize("y_damp", 10, 0.01, 1000, 0.1, false);
  parameterize("alpha", 255, 0, 255, 1, false);
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
  noFill();
  
  strokeWeight(0.25*global_scale);
  controlled_shuffle(working_palette, true);

  png_bg(true);

  const color_array = [];
  for(let i=0; i<working_palette.length; i++){
    color_array.push(color(working_palette[i]));
    color_array[i].setAlpha(alpha);
  }

  const x_grid_size = canvas_x/circles_per_row;
  const y_grid_size = canvas_y/circles_per_column;

  const start_x = margin_x + x_grid_size/2;
  const start_y = margin_y + y_grid_size/2;

  translate(start_x, start_y);

  for(let i=0; i<circles_per_row; i++){
    for(let j=0; j<circles_per_column; j++){
      push();
      let radius = circle_size;
      translate(i*x_grid_size, j*y_grid_size);

      const color_index = floor(noise((i+1)/x_damp, (j+1)/y_damp)*color_array.length);
      if(random()>circle_skip){
        stroke(color_array[color_index]);
        
        while(radius>ring_step_size){
          if(random()>ring_skip) circle(0,0, radius);
          radius -= ring_step_size;
        }
      }
      pop();
    }
  }

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs

