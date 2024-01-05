'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = []


function gui_values(){
  parameterize("margin_x", 0.5, 0, 5.5, 0.25, true);
  parameterize("margin_y", 0.5, 0, 4, 0.25, true);
  parameterize("circles_per_row", 10, 1, 100, 1, false);
  parameterize("circles_per_column", 5, 1, 100, 1, false);
  parameterize("circle_size", 0.5*96, 0.125*96, 2*96, 0.125*96, true);
  parameterize("ring_skip", 0.1, 0, 1, 0.05, false);
  parameterize("circle_skip", 0.1, 0, 1, 0.05, false);
  parameterize("x_damp", 10, 0.01, 1000, 0.1, false);
  parameterize("y_damp", 10, 0.01, 1000, 0.1, false);
}

function setup() {
  common_setup(6*96, 6*96, SVG);
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();
  //actual drawing stuff
  push();
  noFill();
  
  strokeWeight(0.019685*96);
  const color_array = [color("YELLOW"), color("MAGENTA"), color("CYAN")];
  color_array.forEach(c => {
    c.setAlpha(120);
  });
  const start_x = margin_x*96;
  const start_y = margin_y*96;
  const end_x = canvas_x - start_x;
  const end_y = canvas_y - start_y;

  const x_space = end_x-start_x;
  const y_space = end_y-start_y; 

  const x_grid_size = x_space/circles_per_row;
  const y_grid_size = y_space/circles_per_column;

  translate(start_x, start_y);

  for(let i=0; i<circles_per_row; i++){
    for(let j=0; j<circles_per_column; j++){
      push();
      let radius = circle_size;
      translate(i*x_grid_size, j*y_grid_size);

      const color_index = floor(noise((i+1)/x_damp, (j+1)/y_damp)*color_array.length);
      // const color_index = floor(random()*4);
      if(random()>circle_skip){
        stroke(color_array[color_index]);
        
        while(radius>MICRON05){
          if(random()>ring_skip) circle(0,0, radius);
          radius -= MICRON05;
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

