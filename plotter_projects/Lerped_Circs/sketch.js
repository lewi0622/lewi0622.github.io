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
  parameterize("number_circles", 20, 1, 400, 1, false);
  parameterize("starting_radius", 50, 0, 200, 1, true);
  
} 

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();

  //actual drawing stuff
  push();
  noFill();
  stroke(0,0,0,150);

  let point_1 = createVector(
    canvas_x/2 + random(-1,1)*canvas_x/16,
    canvas_y/2 + random(-1,1)*canvas_y/16)
  let point_2 = createVector(
    canvas_x/2 + random(-1,1)*canvas_x/8,
    canvas_y/2 + random(-1,1)*canvas_y/8)
  let point_3 = createVector(
    canvas_x/2 + random(-1,1)*canvas_x/4,
    canvas_y/2 + random(-1,1)*canvas_y/4)
  let points = [point_1, point_2, point_3];

  // let radius = starting_radius;
  for(let j=0; j<points.length-1; j++){
    let start = points[j];
    let end = points[j+1];
    for(let i=0; i<number_circles; i++){
      let target = p5.Vector.lerp(start,end, i/number_circles);
      let radius = starting_radius + 2*abs(dist(start.x, start.y, target.x, target.y)); 
      circle(target.x, target.y, radius);
    }
  }
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
