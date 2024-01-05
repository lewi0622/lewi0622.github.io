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
  parameterize("min_radius", 4, 1, 100, 1, true);
  parameterize("max_radius", 4, 1, 1000, 1, true);
  parameterize("circle_attempts", 10000, 1, 10000, 50, false);
  parameterize("curve_tightness", 0, -5, 5, 0.1, false);
  parameterize("squiggle_pts", 10, 4, 20, 1, false);
} 

function setup() {
  common_setup(8.5*96, 11*96, SVG);
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();

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
  curveTightness(curve_tightness);
  circles.forEach(c => {
    push();
    stroke(random(working_palette));
    // let c_id = floor(map(noise(c.x/100, c.y/100), 0,1, 0, working_palette.length));
    // stroke(working_palette[c_id]);
    translate(c.x, c.y);
    beginShape();
    const curve_rad = c.r*1.5;
    for(let i=0; i<squiggle_pts; i++){
      const x = random(-curve_rad, curve_rad);
      const y = random(-curve_rad, curve_rad);
      curveVertex(x,y);
    }
    endShape();
    // circle(c.x, c.y, c.r*2);
    pop();
  });

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
