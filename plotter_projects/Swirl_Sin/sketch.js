'use strict';
//setup variables
let gif = true;
let animation = true;
const fr = 30;
const capture = false;
const capture_time = 72/30;

const suggested_palettes = [BUMBLEBEE];

let z = 0;
const z_inc = -5;
let bg_c, stroke_c, rot;

function gui_values(){
  parameterize("num_rings", floor(smaller_base/random(4,6)), 1, 1000, 1, false);
  parameterize("radius_inc", random(1,5), 0, 20, 0.1, true);
  parameterize("sin_amp", random(10,20), 0, 90, 0.1, false);
  parameterize("pts_per_pt_stop", 1, 1, 5, 1, false);
  parameterize("pt_stop", floor(random(10,20)), 0, 100, 1, false);
  parameterize("lerp_inc_per_ring", 0.03, 0, 1, 0.01, false);
  parameterize("new_sin_offset", random(45), 0, 180, 1, false);
  parameterize("sin_mult", random(5,10), 0.1, 20, 0.1, false);
  if(type == "svg"){
    parameterize("svg_z", 0, -360, 360, 1, false);
  }
}

function setup() {
  common_setup();
  gui_values();
  bg_c = png_bg(true);
  stroke_c = color(random(working_palette));
  if(type == "png"){
    stroke(stroke_c);
  }
  else{
    gif = false;
    const stroke_c = color("BLACK")
    // stroke_c.setAlpha(150);
    stroke(stroke_c);
    animation = false;
    noLoop();
  }
  rot = random(360);
  strokeWeight(0.5*global_scale);
  // strokeWeight(0.0944882 * 96);
  noFill();
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  refresh_working_palette();

  if(type == "png") background(bg_c);
  else z = svg_z;

  translate(canvas_x/2, canvas_y/2);
  rotate(rot);

  const starting_num_pts = 6;
  let pt_angles = [];
  for(let i=0; i<starting_num_pts; i++){
    //could add randomization to starting angles
    const starting_offset = new_sin_offset;
    pt_angles.push({
      starting_angle: i*360/starting_num_pts,
      ending_angle: i*360/starting_num_pts,
      lerp_val: 1,
      starting_offset: starting_offset,
      ending_offset: starting_offset
    });
  }

  let radius = 0;
  for(let i=0; i<num_rings; i++){
    if(i%pt_stop == 0){
      for(let j=0;j<pts_per_pt_stop; j++){
        pt_angles = add_pt(pt_angles);
      }
    }

    beginShape();
    for(let j=0; j<pt_angles.length; j++){
      const starting_offset = pt_angles[j]["starting_offset"];
      const ending_offset = pt_angles[j]["ending_offset"]
      const start = pt_angles[j]["starting_angle"];
      const end = pt_angles[j]["ending_angle"];
      const lerp_val = pt_angles[j]["lerp_val"];
      if(lerp_val + lerp_inc_per_ring < 1 ) pt_angles[j]["lerp_val"] += lerp_inc_per_ring;
      else pt_angles[j]["lerp_val"] = 1;
      let theta = lerp(start, end, lerp_val);
      theta += sin_amp * sin(z + i*sin_mult + lerp(starting_offset, ending_offset, lerp_val));
      const x = radius * cos(theta);
      const y = radius * sin(theta);
      vertex(x,y);
      
    }
    endShape(CLOSE);
    radius += radius_inc;
  }

  z += z_inc;
  pop();

  global_draw_end();
}
//***************************************************
//custom funcs
function add_pt(pt_angles){
  let largest_diff = 0;
  let diff_index = 0;
  for(let i=0; i<pt_angles.length; i++){
    const [lower_diff, _lower_val, upper_diff, _upper_val] = get_neighbors(pt_angles, i);
    if(lower_diff + upper_diff > largest_diff){
      largest_diff = lower_diff + upper_diff;
      diff_index = i;
    }
  }
  const index = diff_index;
  const [lower_angle_difference, lower_val, upper_angle_difference, upper_val] = get_neighbors(pt_angles, index);

  const lerp_val = pt_angles[index]["lerp_val"];
  const starting_offset = pt_angles[index].starting_offset;
  const ending_offset = pt_angles[index].ending_offset;
  const pt_offset = lerp(starting_offset, ending_offset, lerp_val);

  pt_angles.push({
    starting_angle: lower_val + lower_angle_difference/2,
    ending_angle: lower_val,
    lerp_val: lerp_inc_per_ring,
    starting_offset: pt_offset,
    ending_offset: pt_offset - new_sin_offset
  });
  pt_angles.push({
    starting_angle: upper_val - upper_angle_difference/2,
    ending_angle: upper_val,
    lerp_val: lerp_inc_per_ring,
    starting_offset: pt_offset,
    ending_offset: pt_offset + new_sin_offset
  });

  pt_angles.sort((a,b) => a["ending_angle"] - b["ending_angle"]);

  return pt_angles;
}

function get_neighbors(pt_angles, index){
  const start = pt_angles[index]["starting_angle"];
  const end = pt_angles[index]["ending_angle"];
  const lerp_val = pt_angles[index]["lerp_val"];
  const pt_angle = lerp(start, end, lerp_val);

  let lower_angle_difference, lower_val;
  if(index == 0){
    const lower_neighbor = pt_angles.length-1;
    lower_angle_difference = 360+pt_angle - pt_angles[lower_neighbor]["ending_angle"];
    lower_val = pt_angles[lower_neighbor]["ending_angle"] + lower_angle_difference/2;
    lower_val = lower_val % 360;
  }
  else{
    lower_angle_difference = pt_angle - pt_angles[index-1]["ending_angle"];
    lower_val = pt_angle - lower_angle_difference/2;
  }

  let upper_angle_difference, upper_val;
  if(index == pt_angles.length-1){
    upper_angle_difference = 360+pt_angles[0]["ending_angle"] - pt_angle;
    upper_val = pt_angle + upper_angle_difference/2;
    upper_val = upper_val % 360;
  }
  else{
    upper_angle_difference = pt_angles[index+1]["ending_angle"] - pt_angle;
    upper_val = upper_angle_difference/2 + pt_angle;
  }

  return [lower_angle_difference, lower_val, upper_angle_difference, upper_val];
}