'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 30;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
suggested_palettes = [BIRDSOFPARADISE, SOUTHWEST, NURSERY, SIXTIES]

let shape_points;

function gui_values(){
  parameterize('inc', 0.1, 0.01, 10, 0.01, false);
  parameterize("zinc", 0.1, 0, 1, 0.01, false);
  parameterize("scl", 20, 1, 100, 1, true);
  parameterize("z_iterations", 1, 1, 100, 1, false);

  parameterize("debug", 0, 0, 1, 1, false);
  parameterize("density_multiplier", 0.26, 0.001, 1, 0.01, false);
  parameterize("radius", 45, 1, 100, 1, true);
  parameterize("radius_variation", 0, 0, 1, 0.1, false);
  parameterize('number_of_shapes', 1, 1, 100, 1, false);
  parameterize("point_skip_chance", 0, 0, 1, 0.01, false);
}

function setup() {
  common_setup();
}
//***************************************************
function draw() {
  global_draw_start(false);

  let rows = floor(canvas_y*2 / scl);
  let cols = floor(canvas_x*2 / scl);
  translate(-canvas_x/2, -canvas_y/2);
  //actual drawing stuff

  push();
  let zoff=0;
  for(let z=0; z<z_iterations; z++){
    if(z==1)stroke(c2);
    let yoff=0;
    for(let y=0; y<rows; y++){
      let xoff=0;
      for(let x=0; x<cols; x++){
        let index = x + y * cols;
        let angle = noise(xoff, yoff, zoff) * 360;
        let v = p5.Vector.fromAngle(radians(angle));
        xoff += inc; 
        push();
        translate(x*scl, y*scl);
        rotate(degrees(v.heading()));

        shape_points = [];
        const pt1 = {x:0, y:0};
        const pt2 = {x:scl, y:0};
        out_or_back(pt1, pt2, 1);
        out_or_back(pt1, pt2, -1);
        if(shape_points.length>2){
          fill(random(working_palette));
          // noStroke();
          strokeWeight(0.3*global_scale);
          if(debug){
            noFill();
            stroke("BLACK");
          }
          beginShape();
          for(let i=0; i<shape_points.length+3; i++){
            const ptx = shape_points[i%shape_points.length].x;
            const pty = shape_points[i%shape_points.length].y;
            curveVertex(ptx, pty);

          }
          endShape();
        }
        // line(0,0,scl,0);
        pop();
      }
      yoff += inc;
    }
    zoff += zinc;
  }
  pop();
  
  global_draw_end();
}
//***************************************************
//custom funcs
function out_or_back(first_pt, second_pt, direction){
  if(debug) line(first_pt.x, first_pt.y, second_pt.x, second_pt.y);
  const pt_dist = dist(first_pt.x, first_pt.y, second_pt.x, second_pt.y);
  const num_pts = floor(pt_dist/global_scale * density_multiplier);
  const slope = (second_pt.y-first_pt.y)/(second_pt.x-first_pt.x);
  let skeleton_theta = acos((second_pt.x-first_pt.x)/pt_dist);
  if(slope<=0) skeleton_theta = 360-skeleton_theta;
  for(let i=0; i<=num_pts; i++){
    if(random()<=point_skip_chance) continue;
    let lerp_amt = i/num_pts; //out
    if (direction == -1) lerp_amt = 1-lerp_amt; //back
    const skeleton_x = lerp(first_pt.x, second_pt.x, lerp_amt);
    const skeleton_y = lerp(first_pt.y, second_pt.y, lerp_amt);
    let theta = skeleton_theta - 90; //out
    if(direction == -1) theta += 180; //back
    const curve_radius = radius + map(random(), 0,1, -radius, radius)*radius_variation;
    const x = skeleton_x + curve_radius*cos(theta);
    const y = skeleton_y + curve_radius*sin(theta);
    if(debug) line(skeleton_x, skeleton_y, x, y);
    shape_points.push({x:x, y:y});
  }
}