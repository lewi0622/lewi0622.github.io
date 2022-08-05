gif = false;
fr = 1;

capture = false;
capture_time = 20
function setup() {
  suggested_palette = BIRDSOFPARADISE;
  //looks good in 300x400
  common_setup(gif, SVG);
  colors = gen_n_colors(6)
}
//***************************************************
function draw() {
  capture_start(capture);

  //bleed
  bleed_border = apply_bleed();

  //apply background
  // background("#abada0")

  //actual drawing stuff
  push();

  translate(0, canvas_y);
  trunk_max=40;
  for(let z=0; z<2; z++){
    stroke(colors[z])
    c_leaf_primary = colors[z+3];
    //trunk
    strokeCap(ROUND);
    trunk_weight = 3*global_scale;
    branch_weight = 2*global_scale;
    trunk_seg_len = -10*global_scale;
    trunk_num = floor(random(trunk_max-12, trunk_max));
    trunk_max=trunk_num;
    prev_x = canvas_x/3 * (z+1);
    prev_y = 0;
    for(let i=0; i<trunk_num; i++){
      if(i+5>=trunk_num){
        trunk_weight -= 0.5*global_scale;
        branch_weight = trunk_weight-0.5*global_scale;
      }
      strokeWeight(1*global_scale);

      // new_x = prev_x + random(-5,5)*global_scale;
      new_x = prev_x + map(noise((i+z)/2), 0,1, -5,5)*global_scale;
      new_y = prev_y+trunk_seg_len;

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

  capture_frame(capture, num_frames);
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
    strokeWeight(1*global_scale);
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
    if(random(branch_num/4)>branch_num){
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