'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 5;

const suggested_palettes = [];

const alpha_start = 20;

let left_branch, right_branch, branch_length;
let c_white;

function gui_values(){
  parameterize("branching_frames", 10, 3, 30, 1, false);
  parameterize("max_branch_length", 60, 0, 100, 1, true);
  parameterize("min_branch_length", 2, 0, 100, 1, true);
  parameterize("max_branch_angle", 90, 0, 180, 1, false);
  parameterize("min_branch_angle", 10, 0, 180, 1, false);
  parameterize("max_weight", 10, 1, 50, 0.1, true);
  parameterize("min_weight", 0, 0, 50, 0.1, true);
} 

function setup() {
  common_setup();
  gui_values();

  c_white = color("WHITE");
  c_white.setAlpha(alpha_start);

  strokeCap(ROUND);
  init_branches();

  document.body.style.background = "BLACK";
  pixelDensity(2);
}
//***************************************************
function draw() {
  global_draw_start(false);

  translate(canvas_x/2, canvas_y/2);

  const pct_change = frameCount/(capture_time * fr);

  //change values by pct_change
  //reduce over time:
  //weight, line length, opacity
  //maybe increase line blur?
  //maybe increase alpha over time
  //maybe during pause, keep drawing
  //maybe emphasize nodes by drawing cirlces on them (constellation style)

  branch_length = lerp(max_branch_length, min_branch_length, pct_change);
  const weight = lerp(max_weight, min_weight, pct_change);
  strokeWeight(weight);

  line(left_branch["x"], left_branch["y"], right_branch["x"], right_branch["y"]);
  crawl_branches(right_branch, weight);
  crawl_branches(left_branch, weight);

  if(frameCount > capture_time * fr) noLoop();

  global_draw_end();
}
//***************************************************
//custom funcs

function init_branches(){
  stroke(c_white);

  right_branch = {x:max_branch_length/2, y:0, angle:0, children:[], weight: max_weight};
  left_branch = {x:-max_branch_length/2, y:0, angle:180, children:[], weight: max_weight};
}

function crawl_branches(branch, weight){
  if(branch["children"].length == 0){
    if(frameCount%branching_frames != 0) return; //check if we can add branches this frame
    let theta = branch["angle"] + random(min_branch_angle, max_branch_angle);
    branch.children.push({
      x: branch["x"] + branch_length*cos(theta),
      y: branch["y"] + branch_length*sin(theta),
      angle: theta,
      children: [],
      weight: weight
    });
    theta = branch["angle"] - random(min_branch_angle, max_branch_angle);
    branch.children.push({
      x: branch["x"] + branch_length*cos(theta),
      y: branch["y"] + branch_length*sin(theta),
      angle: theta,
      children: [],
      weight: weight
    });

    return;
  }
  else{
    for(let i=0; i<branch.children.length; i++){
      const child = branch.children[i];
      //draw
      // strokeWeight(child.weight);
      line(branch["x"], branch["y"], child["x"], child["y"]);

      //recurse with children branches
      crawl_branches(child, weight);
    }
  }
}
