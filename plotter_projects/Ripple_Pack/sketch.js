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
  parameterize("min_radius", 1, 1, 100, 1, true);
  parameterize("max_radius", 1, 1, 1000, 1, true);
  parameterize("circle_attempts", 45, 1, 200, 1, false);
  parameterize("ripples", 50, 1, 200, 1, false);
  parameterize("ripple_dist", 10, 1, 100, 1, true);
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
  const circles = [];

  for(let i=0; i<circle_attempts; i++){
    let new_radius = random(min_radius, max_radius)
    const new_c = {
      x:random(new_radius, canvas_x-new_radius), 
      y:random(new_radius, canvas_y-new_radius), 
      r:new_radius,
    };

    let circle_bad = false;
    for(let j=0; j<circles.length; j++){
      let c = circles[j];
      let overlap = c.r + new_c.r - dist(c.x, c.y, new_c.x, new_c.y);
      if(overlap <= 0) continue;
      new_c.r -= overlap;
      if(new_c.r < min_radius){
        circle_bad = true;
        break;
      }
    }
    if(!circle_bad) circles.push(new_c);
  }

  for(let i=0; i<ripples; i++){
    circles.forEach(c => {
      let c_id = floor(map(noise(c.x/100, c.y/100), 0,1, 0, working_palette.length));
      let radius = map(i/ripples, 0,1, c.r*2 + ripples*ripple_dist, c.r*2);
      // stroke(working_palette[c_id]);
      circle(c.x, c.y, radius);
    });
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
