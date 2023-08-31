'use strict';

//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;


function gui_values(){
  parameterize("number_of_shapes", floor(random(30,100)), 1, 100, 1, false);
  parameterize("rotation_per_shape", round(random(-45,45)), -45, 45, 1, false);
  parameterize("starting_radius", 300, 0, 1000, 1, true);
  parameterize("fill_shape", round(random()), 0, 1, 1, false);
  parameterize("polygon_n_sides", floor(random(3,13)), 3, 200, 1, false);
}

function setup() {
  common_setup(6*96, 6*96, SVG);
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  if(!fill_shape) noFill();
  translate(canvas_x/2, canvas_y/2);
  for(let i=0; i<number_of_shapes; i++){
    rotate(rotation_per_shape);
    const radius = lerp(starting_radius, 0, i/number_of_shapes);
    polygon(0,0,radius,polygon_n_sides);
  }

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs