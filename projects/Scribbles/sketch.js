'use strict';
//setup variables
const gif = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
let suggested_palette;

//project variables
let amp;


function gui_values(){

}

function setup() {
  suggested_palette = random([BIRDSOFPARADISE, MUTEDEARTH, OASIS]);
  common_setup(gif);
}
//***************************************************
function draw() {
  capture_start(capture);

  //bleed
  const bleed_border = apply_bleed();

  refresh_working_palette();
  if(gif){
    //randomize noise seed
    noiseSeed(random(10000))
  }

  //apply background
  let bg_c = random(working_palette)
  background(bg_c)
  reduce_array(working_palette, bg_c)

  //actual drawing stuff
  push();

  center_rotate(random([0,90,180,270]));

  const tile_x = canvas_x/100;
  const tile_y = canvas_y/10;

  strokeWeight(5*global_scale);

  for(let j=0; j<5; j++){
    stroke(random(working_palette))

    translate(0, 65*global_scale);
    amp = 1*global_scale;

    beginShape();
    noFill();
    curveVertex(-10*global_scale,0);
    curveVertex(-10*global_scale,0);
    for(let i = 0;  i<200; i++){
      const l_r = random([-1,1,1])*tile_x*3;
      const u_d = random([-1,1])*amp;
      curveVertex(i*tile_x+noise(i+j)*l_r, noise(i+j)*u_d);
      amp +=0.5*global_scale;
    }

    endShape();

  }
  pop();
  //cutlines
  apply_cutlines(bleed_border);

  capture_frame(capture);
}
//***************************************************
//custom funcs
function noise_curve(){
  beginShape();
  amp = 0.5*global_scale;
  for(let j=0; j<200; j++){
    vertex(j*2*global_scale, noise(j)*amp)
    if(j<100){
      amp += 0.15*global_scale;
    }
    else{
      amp -= 0.15*global_scale;
    }
  }
  endShape();
}


