'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

let x_fourth, y_fourth, copic_palette;
const suggested_palettes = []

function gui_values(){
  parameterize("circle_num", 50, 1, 300, 1, false);
  parameterize("radius_inc", 10, 0, 100, 1, true);
  parameterize("starting_radius", 15, 1, 400, 1, true);
  parameterize("freq", 1, -50, 50, 1, false);
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
  stroke(0,0,0,150);
  // strokeWeight(PITTPEN);
  // translate(0, canvas_y/2);
  translate(canvas_x/2, canvas_y/2);
  // rotate(random(360));
  let radius = starting_radius;
  let x_offset = random(360);
  let y_offset = random(360);

  // let points = [random(canvas_x/3), random(canvas_x/3,canvas_x/2), random(canvas_x/2, canvas_x*2/3)];
  // let total_circles = circle_num/points.length-1;
  // let previous_x = points[0];
  // for(let j=0; j<points.length-1; j++){
  //   let start = points[j];
  //   let end = points[j+1];
  for(let i=0; i<circle_num; i++){
    // let x = lerp(start,end,i/total_circles) + sin(i*j*freq + x_offset)*radius_inc;
    let x = sin(i*freq + x_offset)*radius_inc;
    // let y = sin(i*j*freq + y_offset)*radius_inc;
    let y = sin(i*freq + y_offset)*radius_inc;
    circle(x,y, radius);
    // radius += radius_inc+(x-previous_x)*2;
    radius += radius_inc;
    // previous_x=x;
  }
  // }
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
