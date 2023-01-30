'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
suggested_palettes = [COTTONCANDY, SOUTHWEST, OASIS]


function gui_values(){
  parameterize("base_size", 20, 1, 100, 1, false);
  parameterize("num_points", 200, 1, 500, 1, false);
  parameterize("amp", 0.5, 0, 20, 0.1, true);
  parameterize("amp_diff", 0.15, 0.01, 1, 0.01, true);
}

function setup() {
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

  for(let j=0; j<num_points; j++){
    vertex(j*2*global_scale, noise(j)*amp)
    if(j<num_points/2){
      amp += amp_diff;
    }
    else{
      amp -= amp_diff;
    }
  }

  vertex(canvas_x*1.5,0);
  endShape();
}


