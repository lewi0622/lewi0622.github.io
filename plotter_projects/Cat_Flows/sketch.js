'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 30;
const capture = false;
const capture_time = 10;

const suggested_palettes = [BIRDSOFPARADISE, SOUTHWEST, NURSERY, SIXTIES]

let shape_points;

function gui_values(){
  parameterize('inc', random(0.01,0.25), 0.01, 10, 0.01, false);
  parameterize("scl", random(20,50), 1, 100, 1, true);
  parameterize("debug", 0, 0, 1, 1, false);
  parameterize("density_multiplier", random(0.07,0.25), 0.001, 1, 0.01, false);
  parameterize("radius", 45, 1, 100, 1, true);
  parameterize("radius_variation", 0, 0, 1, 0.1, false);
  parameterize("point_skip_chance", 0, 0, 1, 0.01, false);
  parameterize("num_inline", 50, 1, 100, 1, false);
}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();

  let rows = floor(canvas_y*2 / scl);
  let cols = floor(canvas_x*2 / scl);
  //actual drawing stuff

  //todo remake the cat shape from scratch with a square base,, bezier curves with ear sharpness/roundess factors, and fill 

  push();
  translate(-canvas_x/2, -canvas_y/2);
  let yoff=0;
  for(let y=0; y<rows; y++){
    let xoff=0;
    for(let x=0; x<cols; x++){
      const stroke_c = random(working_palette);
      if(type == "png") stroke("BLACK");
      else stroke(stroke_c);
      let index = x + y * cols;
      let angle = noise(xoff, yoff) * 360;
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
        if(type == "png") fill(stroke_c);
        else fill("WHITE");
        strokeWeight(0.3*global_scale);
        if(debug){
          noFill();
          stroke("BLACK");
        }
        let center_x = Math.max(...shape_points.map(o => o.x)) / 2;
        let center_y = 0;
        for(let j=0; j<num_inline; j++){
          if(type == "png" && j>0) noStroke();
          if(j/num_inline > 0.05) curveTightness(1);
          else curveTightness(0);
          //full outline plus ears
          beginShape();
          for(let i=0; i<shape_points.length+3; i++){
            let ptx = shape_points[i%shape_points.length].x;
            let pty = shape_points[i%shape_points.length].y;
            pty = lerp(pty, center_y, j/num_inline);
            if(i%shape_points.length==0) pty *= 0.8;
            if((i+1)%shape_points.length>0 && i%shape_points.length<0) pty *= 0.8;
            curveVertex(ptx, pty);
            //trying to remove feet, tbd

            // if(i>(shape_points.length+3)/2) circle(ptx,pty,5);
            // if(i==8)circle(ptx,pty,10);
          }
          endShape();
          // else{
          //   //just fill lines
          //   let pty = shape_points[0].y;
          //   pty = lerp(pty, center_y, j/num_inline);
          //   line(0, pty, center_x*2, pty);
          //   line(0, -pty, center_x*2, -pty);
          // }
        }
        if(num_inline>1) line(0,0,center_x*2, center_y);

        //whiskers
        push();
        translate(center_x, radius * random(0.6, 0.7));
        stroke("BLACK");
        let num_whiskers = floor(random(3,5));
        let whisker_offset = scl * random(0.03, 0.07);
        let whisker_length = scl * random(0.3,0.7);
        let starting_rot = -20;
        for(let i=0; i<num_whiskers; i++){
          push();
          rotate(lerp(starting_rot, 20, (i+0.5)/num_whiskers));
          line(whisker_offset, 0, whisker_length, 0);
          line(-whisker_offset, 0, -whisker_length, 0);
          pop();
        }
        pop();
      }

      pop();
    }
    yoff += inc;
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