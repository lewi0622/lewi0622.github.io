'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
suggested_palettes = [COTTONCANDY, SIXTIES, SUPPERWARE]


function gui_values(){
  parameterize("num_circles", 50, 1, 500, 1, false);
  parameterize("starting_radius", 525, 1, 1000, 1, true);
  parameterize("ending_radius", 0, 0, 500, 1, true);
  parameterize("drift_x_per_loop", 0, -10, 10, 0.1, true);
  parameterize("drift_y_per_loop", 0, -10, 10, 0.1, true);
  parameterize("starting_corner_radius", 270, 0, 360, 1, false);
  parameterize("ending_corner_radius", -140, -360, 360, 1, false);
  parameterize("rotation_per_loop", 0, -180, 180, 0.01, false);
}

function setup() {
  common_setup(6*96, 6*96, SVG);
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  rectMode(CENTER);
  translate(canvas_x/2, canvas_y/2);
  
  for(let i=0; i<num_circles; i++){ 
    push();
    const x = i*drift_x_per_loop;
    const y = i*drift_y_per_loop;

    translate(x,y);
    rotate(rotation_per_loop*i);

    const radius = lerp(starting_radius, ending_radius, i/num_circles);
    const corner_radius = constrain(lerp(starting_corner_radius, ending_corner_radius, i/num_circles), 0, 360);
    square(0, 0, radius, corner_radius, corner_radius, corner_radius, corner_radius);
    pop();
  }

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs