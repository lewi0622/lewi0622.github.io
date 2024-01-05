'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = []


function gui_values(){
  parameterize("margin_x", 0.25, 0, 5.5, 0.25, true);
  parameterize("margin_y", 0.25, 0, 4, 0.25, true);
  parameterize("circles_per_row", 30, 1, 100, 1, false);
  parameterize("circles_per_column", 30, 1, 100, 1, false);
  parameterize("circle_size", 0.35*96, 0.125*96, 2*96, 0.125*96, true);
  parameterize("ring_skip", 0.25, 0, 1, 0.05, false);
  parameterize("circle_skip", 0, 0, 1, 0.05, false);
  parameterize("x_damp", 10, 0.01, 1000, 0.1, false);
  parameterize("y_damp", 10, 0.01, 1000, 0.1, false);
}

function setup() {
  common_setup(8.5*96, 11*96, SVG);
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

  let offset_x = circle_size/2+start_x; //center design plus margin
  let offset_y = circle_size/2+start_y;

  for(let i=0; i<circles_per_row; i++){
    for(let j=0; j<circles_per_column; j++){
      let radius = circle_size;
      const x = offset_x + i*x_grid_size;
      const y = offset_y + j*y_grid_size;

      if((x>(canvas_x/2 - start_x) && x<(canvas_x/2+start_x)) || (y>(canvas_y/2 - start_y) && y<(canvas_y/2 + start_y))) continue;
      const color_index = floor(noise((i+1)/x_damp, (j+1)/y_damp)*color_array.length);
      if(random()>circle_skip){
        stroke(color_array[color_index]);
        
        while(radius>MICRON05){
          if(random()>ring_skip) circle(x,y, radius);
          radius -= MICRON05;
        }
      }
    }
  }

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs

