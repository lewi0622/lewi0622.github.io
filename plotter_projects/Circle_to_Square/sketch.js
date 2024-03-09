'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [COTTONCANDY, SIXTIES, SUPPERWARE]


function gui_values(){
  parameterize("fill_in", 1, 0, 1, 1, false);
  parameterize("num_circles", floor(random(15,150)), 1, 500, 1, false);
  parameterize("starting_radius", random(canvas_x/2,canvas_x), 1, 1000, 1, true);
  parameterize("ending_radius", 0, -500, 500, 1, true);
  parameterize("drift_x_per_loop", 0, -10, 10, 0.1, true);
  parameterize("drift_y_per_loop", 0, -10, 10, 0.1, true);
  parameterize("cornering_end", random(-1,1), -4, 4, 0.1, false);
  parameterize("cornering_start", random(-1,1), -4, 4, 0.1, false);
  parameterize("rotation_per_loop", random(-180,180), -180, 180, 0.01, false);
}

function setup() {
  common_setup();
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  rectMode(CENTER);
  translate(canvas_x/2, canvas_y/2);
  if(!fill_in) noFill();
  for(let i=0; i<num_circles; i++){ 
    push();
    const x = i*drift_x_per_loop;
    const y = i*drift_y_per_loop;

    translate(x,y);
    rotate(rotation_per_loop*i);

    const radius = lerp(starting_radius, ending_radius, i/num_circles);
    let corner_radius = constrain(lerp(radius*cornering_start, radius*cornering_end, (i+1)/num_circles), 0, starting_radius);
    square(0, 0, radius, corner_radius, corner_radius, corner_radius, corner_radius);
    pop();
  }

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs