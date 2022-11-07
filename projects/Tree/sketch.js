'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
let suggested_palette;

//project variables
let c_leaf_primary, branch_weight;


function gui_values(){

}

function setup() {
  suggested_palette = BIRDSOFPARADISE;
  //looks good in 300x400
  common_setup(gif, P2D, 300);
}
//***************************************************
function draw() {
  capture_start(capture);

  //bleed
  const bleed_border = apply_bleed();

  refresh_working_palette();
  let branch_color;
  if(arrayEquals(working_palette[0], [87, 61, 38, 255])){
    branch_color = working_palette[0];
  }
  else{
    branch_color = random(working_palette)
  }
  reduce_array(working_palette, branch_color)
  stroke(branch_color);

  //apply background
  const bg_c = random(working_palette)
  background(bg_c)
  reduce_array(working_palette, bg_c)

  working_palette.forEach(c => {
    c[3] = 100;
  });

  //actual drawing stuff
  push();

  translate(canvas_x/2, canvas_y);
  let trunk_max=40;
  for(let z=0; z<3; z++){
    c_leaf_primary = random(working_palette);
    if(working_palette.length>1){
      reduce_array(working_palette, c_leaf_primary);
    }
    //trunk
    strokeCap(ROUND);
    let trunk_weight = 3*global_scale;
    branch_weight = 2*global_scale;
    const trunk_seg_len = -10*global_scale;
    const trunk_num = floor(random(trunk_max-12, trunk_max));
    trunk_max=trunk_num;
    let prev_x = floor(random(-canvas_x/8,canvas_x/8));
    let prev_y = 0;
    for(let i=0; i<trunk_num; i++){
      if(i+5>=trunk_num){
        trunk_weight -= 0.5*global_scale;
        branch_weight = trunk_weight-0.5*global_scale;
      }
      strokeWeight(trunk_weight);

      // new_x = prev_x + random(-5,5)*global_scale;
      const new_x = prev_x + map(noise((i+z)/2), 0,1, -5,5)*global_scale;
      const new_y = prev_y+trunk_seg_len;
      line(prev_x, prev_y, new_x, new_y);

      if(trunk_weight<=0 || i+1 == trunk_num){
        leaves(new_x, new_y);
        break;
      }

      if(i/trunk_num>0.3 && random(trunk_num/2)>trunk_num/(i+1)){
        branch(trunk_num-i, new_x, new_y, branch_weight);
      }
      prev_x = new_x;
      prev_y += trunk_seg_len;
    }
  }
  pop();
  //cleanup
  apply_cutlines(bleed_border);

  capture_frame(capture);
}
//***************************************************
//custom funcs
function branch(branch_num, start_x, start_y, start_weight){
  let weight = start_weight;
  push();
  let dir = random([-1,1])
  let prev_branch_x = start_x;
  let prev_branch_y = start_y;
  let branch_y;

  let branch_x = prev_branch_x + map(noise(branch_num), 0,1, 5,10)*dir*global_scale
  if(weight<branch_weight){
    branch_y = prev_branch_y - map(noise(branch_num), 0,1, 0,10)*global_scale;
  }
  else{
    branch_y = prev_branch_y - map(noise(branch_num), 0,1, 7,10)*global_scale;
  }
  for(let j=0; j<branch_num; j++){
    if(j+8>=branch_num){
      weight -= 0.25*global_scale;
    }

    //round here for scaling issues
    if(round(weight*1000)/1000<global_scale || j+1==branch_num){
      leaves(prev_branch_x, prev_branch_y);
      break;
    }
    strokeWeight(weight);
    line(prev_branch_x, prev_branch_y, branch_x, branch_y);
    if(j/branch_num>0.5){
      leaves(prev_branch_x, prev_branch_y);
    }
    prev_branch_x = branch_x;
    prev_branch_y = branch_y;

    if(random()>0.5){
      branch_x = random(-3,10)*dir*global_scale + prev_branch_x;
    }
    else{
      branch_x = prev_branch_x + map(noise(branch_num), 0,1, -3,10)*dir*global_scale;
    }
    if(weight<branch_weight){
      branch_y = prev_branch_y - map(noise(branch_num), 0,1, 0,10)*global_scale;
    }
    else{
      branch_y = prev_branch_y - map(noise(branch_num), 0,1, 7,10)*global_scale;
    }
    //branch recursion
    if(random(branch_num/4)>branch_num/(j+1)){
      branch(branch_num-j, prev_branch_x, prev_branch_y, weight-random([0,0.25*global_scale]));
    }
  }
  pop();
}

function leaves(x,y){
  push();
  noStroke();

  fill(c_leaf_primary);
  for(let i=0; i<6; i++){
    circle(x+random(-2,2)*global_scale, y+random(-2,2)*global_scale, 5*global_scale)
  }
  pop();
}