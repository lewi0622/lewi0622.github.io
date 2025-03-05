'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

function gui_values(){
  parameterize("starting_rad", base_x, 0, base_x*2, 1, true);
  parameterize("circ_pts", 12, 1, 60, 1, false);
  parameterize("line_pts", 20, 1, 100, 1, false);
  parameterize("iterations", 100, 1, 500, 1, false);
  parameterize("i_damp", 1, 0.1, 100, 0.1, false);
  parameterize("j_damp", 100, 1, 1000, 1, false);
  parameterize("k_damp", 10, 1, 100, 1, false);
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
  strokeWeight(2*global_scale);
  png_bg(false);
  noFill();
  translate(canvas_x/2, canvas_y/2);
  const ang_step = 360/circ_pts;
  let radius = starting_rad;
  const pts = [];
  for(let i=0; i<circ_pts; i++){
    const starting_pt = {
      x:radius * cos(i * ang_step),
      y:radius * sin(i * ang_step)
    };
    pts.push({
      x:starting_pt.x + random(-10,10),
      y:starting_pt.y + random(-10,10)
    });
  }

  const radius_step = radius/iterations;
  for(let k=0; k<iterations; k++){
    radius -= radius_step;
    for(let i=0; i<circ_pts; i++){
      push();
      const starting_pt = {
        x:radius * cos(i * ang_step),
        y:radius * sin(i * ang_step)
      };
      const end_pt = {
        x:radius * cos((i+1) * ang_step),
        y:radius * sin((i+1) * ang_step)
      };
      //locate midpoint
      const mid_pt = {
        x: (starting_pt.x+end_pt.x)/2,
        y: (starting_pt.y+end_pt.y)/2
      };
      const rel_start_pt = {
        x: mid_pt.x-starting_pt.x,
        y: mid_pt.y-starting_pt.y
      };
      const rel_end_pt = {
        x: mid_pt.x-end_pt.x,
        y: mid_pt.y-end_pt.y
      };
      const line_radius = dist(mid_pt.x, mid_pt.y, end_pt.x, end_pt.y);
      translate(mid_pt.x, mid_pt.y);
      const v_start = createVector(rel_start_pt.x, rel_start_pt.y);
      const ang_start = v_start.heading();
      const line_ang_step = 180/line_pts;
      beginShape();
      for(let j=0; j<=line_pts; j++){
        const theta = ang_start + j * line_ang_step;
        const min_pct = 0.5;
        let pct = lerp(1,min_pct,j/line_pts*2);
        if(j/line_pts>0.5) pct = lerp(min_pct,1,j/line_pts*2-1);
        const rad = line_radius * map(noise(i/i_damp,j/j_damp,k/k_damp),0,1,pct,1);
        const x = rad * cos(theta);
        const y = rad * sin(theta);
        vertex(x,y);
      }
      endShape();
      pop();
    }
  }
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
