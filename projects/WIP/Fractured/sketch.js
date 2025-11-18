'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 5;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

function gui_values(){
  parameterize("num_triangles", 100, 1, 400, 1, false);
  parameterize("shape_size", 100, 1, 500, 1, true);
  parameterize("ang_step_size", 100, -360, 360, 1, false);
  parameterize("radius_step_size", 5, 0.1, 10, 0.1, true);

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
  translate(canvas_x/2, canvas_y/2);
  let ang = 0;
  let radius = -shape_size;
  for(let i=0; i<num_triangles; i++){
    push();
    ang += random(ang_step_size);
    radius += random(radius_step_size);
    rotate(ang);
    translate(0, radius);
    stroke("WHITE");
    rect(-shape_size/2, 0, shape_size, shape_size)
    translate(-shape_size/2,0)
    for(let j=0; j<200; j++){
      translate(random(shape_size/100), 0);
      push();
      stroke(random(working_palette));
      rotate(map(noise(i/100, j/100), 0,1, -30,30));
      line(0, 0, 0, shape_size);
      pop();
    }
    pop();
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs