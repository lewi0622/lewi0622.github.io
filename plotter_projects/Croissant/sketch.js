'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [SUMMERTIME, SOUTHWEST];

function gui_values(){
  parameterize("number_of_circles", floor(random(50, 400)), 1, 1000, 1, false);
  parameterize("points_per_shape", random([3,4,5,6,7,8,9,10,11,12,100]), 3, 300, 1, false);
  parameterize("overall_rotation", random(360), 0, 360, 15, false);
  parameterize("rotation_per_shape", random(-5,5), -10, 10, 0.1, false);
  parameterize("num_pts", 5, 2, 20, 1, false);
  parameterize("margin", smaller_base*0.1, -smaller_base/2, smaller_base/2, 1, true);
  parameterize("min_radius", 0.1*smaller_base, 0, smaller_base, 1, true);
  parameterize("max_radius", 0.25*smaller_base, 0, smaller_base, 1, true);
  parameterize("repeat_shape", 2, 1, 100, 1, false);
}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();

  let weight = 1 * global_scale;
  let bg_c = png_bg(true);
  const fill_c = random(working_palette);
  reduce_array(working_palette, fill_c);
  const stroke_c = random(working_palette);
  line_blur(stroke_c, 2*global_scale);

  //create points
  const pts = [];
  let min_x = canvas_x-margin;
  let max_x = margin;
  let min_y = canvas_y-margin;
  let max_y = margin;
  for(let i=0; i<num_pts; i++){
    const pt = {x: random(margin, canvas_x-margin), y: random(margin, canvas_y-margin), radius: random(min_radius, max_radius)};
    if(i==0 || i+1==num_pts) pt.radius = 0;
    pts.push(pt);

    if(pt.x - pt.radius<min_x) min_x = pt.x - pt.radius;
    if(pt.x + pt.radius>max_x) max_x = pt.x + pt.radius;
    if(pt.y - pt.radius<min_y) min_y = pt.y - pt.radius;
    if(pt.y + pt.radius>max_y) max_y = pt.y + pt.radius;
  }

  //find overall distance
  let total_dist = 0;
  for(let i=0; i<num_pts-1; i++){
    const pt1 = pts[i];
    const pt2 = pts[i+1];
    total_dist += dist(pt1.x, pt1.y, pt2.x, pt2.y);
  }

  //evenly distribute number of circles across point groupings
  const circles_per_pt_group = [];
  for(let i=0; i<num_pts-1; i++){
    const pt1 = pts[i];
    const pt2 = pts[i+1];
    const distance = dist(pt1.x, pt1.y, pt2.x, pt2.y);
    circles_per_pt_group.push(distance/total_dist * number_of_circles);
  }

  //actual drawing stuff
  push();
  fill(fill_c);
  stroke(stroke_c);

  //center design
  const offset_x = (canvas_x - max_x-min_x)/2;
  const offset_y = (canvas_y - max_y-min_y)/2;
  translate(offset_x, offset_y);

  let loop_count = 0;
  for(let i=0; i<num_pts-1; i++){
    const start_pt = pts[i];
    const end_pt = pts[i+1];
    const pt_num_circles = circles_per_pt_group[i];
    for(let j=0; j<pt_num_circles; j++){
      const pct = j/pt_num_circles;
      const x = lerp(start_pt.x, end_pt.x, pct);
      const y = lerp(start_pt.y, end_pt.y, pct);
      const rad = lerp(start_pt.radius, end_pt.radius, pct);
      push();
      translate(x,y);
      rotate(overall_rotation);
      rotate(loop_count*rotation_per_shape);
      for(let k=0; k<repeat_shape; k++){
        polygon(0, 0, rad + (repeat_shape - k) * weight/2 , points_per_shape);
      }
      pop();
      loop_count++;
    } 
  }
  pop();

  global_draw_end();
}
//***************************************************
//custom funcs

