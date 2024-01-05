'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 8
const suggested_palettes = []

function gui_values(){
  parameterize("cols", 10, 1, 100, 1, false);
  parameterize("rows", 10, 1, 100, 1, false);
  parameterize("spacing", 0.1*96, 0, 8*96, 0.5, true);
  parameterize("polygon_sides", 4, 3, 100, 1, false);
}

function setup() {
  common_setup(8*96, 6*96, SVG);
}

//***************************************************
function draw() {
  global_draw_start();
  push();
  noFill();
  stroke(5);
  const shape_radius = min((canvas_x-(cols+1)*spacing)/cols, (canvas_y-(rows+1)*spacing)/rows);
  for(let i=0; i<cols; i++){
    for(let j=0; j<rows; j++){
      push();
      translate(spacing*(i+1), spacing*(j+1));
      polygon(shape_radius/2, shape_radius/2, shape_radius, polygon_sides);
      pop();
    }
  }
  pop();
  
  global_draw_end();
}
//***************************************************
//custom funcs