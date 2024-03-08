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
  parameterize("polygon_n_sides", floor(random(3,13)), 3, 100, 1, false);
  parameterize("number_of_passes", 1, 1, 20, 1, false);
  parameterize("spacing_per_pass", 1, 1, 10, 0.1, true);
  parameterize("negative_spacing", 1, 0, 1, 1, false);
}

function setup() {
  common_setup(6*96, 6*96);
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
    for(let j=0; j<number_of_passes; j++){
      let pass_radius = radius - j*spacing_per_pass;
      if(!negative_spacing && pass_radius<0) continue;
      polygon(0,0,pass_radius,polygon_n_sides);
    }

  }

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs