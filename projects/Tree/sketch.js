gif = false;
fr = 1;

capture = false;
capture_time = 10
num_frames = capture_time*fr;
capturer = new CCapture({format:'png', name:String(fr), framerate:fr});
function setup() {
  common_setup(gif);
  if(!capture){
    frameRate(fr);
  }
}
//***************************************************
function draw() {
  capture_start(capture);

  //bleed
  bleed_border = apply_bleed();

  working_palette = [...palette];

  //apply background
  background("WHITE")

  //actual drawing stuff
  push();

  translate(canvas_x/2, canvas_y);

  for(let z=0; z<3; z++){
    c_leaf_primary = random(palette);
    reduce_array(palette, c_leaf_primary);
    c_leaf_secondary = random(palette);
    c_leaf_primary[3] = 100;
    c_leaf_secondary[3] = 100;
    //trunk
    strokeCap(ROUND);
    trunk_weight = 3*global_scale;
    branch_weight = 2*global_scale;
    trunk_seg_len = -10*global_scale;
    trunk_num = floor(random(15,40));
    prev_x = floor(random(-100,100))*global_scale;
    prev_y = 0;
    for(let i=0; i<trunk_num; i++){
      if(i+5>=trunk_num){
        trunk_weight -= 0.5*global_scale;
        branch_weight = trunk_weight-0.5*global_scale;
      }
      strokeWeight(trunk_weight);
      
      new_x = prev_x + random(-3,3)*global_scale;
      new_y = prev_y+trunk_seg_len;
      line(prev_x, prev_y, new_x, new_y);
      if(i/trunk_num>0.3 && random(trunk_num/2)>trunk_num/(i+1)){
        branch(trunk_num-i, new_x, new_y, branch_weight);
      }
      prev_x = new_x;
      prev_y += trunk_seg_len;
    }
  }
  pop();
  //cleanup
  apply_cutlines();

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
  let branch_x = random(5*global_scale,10*global_scale)*dir + prev_branch_x;
  if(weight<branch_weight){
    branch_y = prev_branch_y - random(-7,10)*global_scale;
  }
  else{
    branch_y = prev_branch_y - random(7,10)*global_scale;
  }
  for(let j=0; j<branch_num; j++){
    if(j+8>=branch_num){
      weight -= 0.25*global_scale;
    }
    if(weight<0){
      break;
    }
    strokeWeight(weight);
    line(prev_branch_x, prev_branch_y, branch_x, branch_y);
    if(j/branch_num>0.5){
      leaves(prev_branch_x, prev_branch_y);
    }
    prev_branch_x = branch_x;
    prev_branch_y = branch_y;

    branch_x = random(-3,10)*dir*global_scale + prev_branch_x;
    if(weight<branch_weight){
      branch_y = prev_branch_y - random(-2,10)*global_scale;
    }
    else{
      branch_y = prev_branch_y - random(7,10)*global_scale;
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

  [c_leaf_primary, c_leaf_secondary].forEach(c => {
    fill(c);
    for(let i=0; i<4; i++){
      circle(x+random(-1,1)*global_scale, y+random(-1,1)*global_scale, 5*global_scale)
    }
  });
  pop();
}