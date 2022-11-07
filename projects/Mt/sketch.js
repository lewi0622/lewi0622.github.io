'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
let suggested_palette;


function gui_values(){

}

function setup() {
  suggested_palette = random([COTTONCANDY, SOUTHWEST, OASIS]);
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
  bg_horizontal_strips(2);

  //actual drawing stuff
  push();
  noFill();
  const base_size = 20;
  let mt_size = working_palette.length*base_size*global_scale;
  translate(0, canvas_y/2)
  for(let i=0; i<working_palette.length; i){
    push();
    strokeWeight(mt_size);
    const col = random(working_palette);
    stroke(col);

    noise_curve();

    reduce_array(working_palette, col);
    mt_size -= base_size*global_scale;
    pop();
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
  vertex(-canvas_x/2, 0);

  let amp = 0.5*global_scale;
  for(let j=0; j<200; j++){
    vertex(j*2*global_scale, noise(j)*amp)
    if(j<100){
      amp += 0.15*global_scale;
    }
    else{
      amp -= 0.15*global_scale;
    }
  }

  vertex(canvas_x*1.5,0);
  endShape();
}


