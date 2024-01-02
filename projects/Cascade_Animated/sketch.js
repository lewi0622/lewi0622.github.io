'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 10;

suggested_palettes = [COTTONCANDY, SIXTIES, SUPPERWARE]
let rot = 0;
let rot_inc = 0.25;
let bg_c;

function gui_values(){
  parameterize("num_circles", 50, 1, 500, 1, false);
  parameterize("starting_radius", 300, 1, 1000, 1, true);
  parameterize("ending_radius", 0, 0, 500, 1, true);
  parameterize("drift_x_per_loop", 0, -10, 10, 0.1, true);
  parameterize("drift_y_per_loop", 0, -10, 10, 0.1, true);
  parameterize("cornering_end", 0, -4, 4, 0.1, false);
  parameterize("cornering_start", 0.5, -4, 4, 0.1, false);
  parameterize("rotation_per_loop", 0, -180, 180, 0.01, false);
}

function setup() {
  common_setup();
  bg_c = random(working_palette);
  working_palette = controlled_shuffle(working_palette, true);
  if(working_palette.length>3) working_palette.splice(3, working_palette.length-3);
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  // strokeWeight(0.2*global_scale);
  noStroke();
  set_linear_gradient(working_palette, 0, 0, canvas_x, canvas_y, "fill");
  rect(0,0,canvas_x, canvas_y);
  rectMode(CENTER);
  translate(canvas_x/2, canvas_y/2);
  
  for(let i=0; i<num_circles; i++){ 
    push();
    const x = i*drift_x_per_loop;
    const y = i*drift_y_per_loop;

    translate(x,y);
    rotate(rot*i);

    const radius = lerp(starting_radius, ending_radius, i/num_circles);
    let corner_radius = constrain(lerp(radius*cornering_start, radius*cornering_end, (i+1)/num_circles), 0, starting_radius);
    set_linear_gradient(working_palette, -radius/2, 0, radius/2, 0, "fill");
    square(0, 0, radius, corner_radius, corner_radius, corner_radius, corner_radius);
    pop();
  }

  rot += rot_inc;
  pop();

  global_draw_end();
}
//***************************************************
//custom funcs