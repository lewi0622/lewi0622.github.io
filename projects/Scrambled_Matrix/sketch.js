'use strict';
//setup variables
const gif = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
let suggested_palette;


function gui_values(){

}

function setup() {
  suggested_palette = random([COTTONCANDY, SOUTHWEST, MUTEDEARTH]);
  common_setup(gif);
}
//***************************************************
function draw() {
  capture_start(capture);

  //bleed
  const bleed_border = apply_bleed();

  let working_palette = JSON.parse(JSON.stringify(palette));
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

  const step=20*global_scale;
  const square_size = 30*global_scale;
  const x_off = canvas_x/8 + square_size/2;
  const y_off = canvas_y/8 + square_size/2;

  let isFill=false;
  noFill();
  for(let i=0; i<14; i++){
    push();
    const c = random(working_palette);
    stroke(c);

    for(let j= 0; j<14; j++){
      if(random([0,1,2])==0){
        fill(c);
        isFill=true;
      }
      else{
        noFill();
        isFill=false;
      }

      const loop_noise = noise(i+j)*random([-1,1]);
      strokeWeight(random(1,5)*global_scale);

      push();
      translate(i*step+x_off, j*step+y_off);
      square(0, 0, loop_noise*square_size);
      if(isFill==true){
        stroke(bg_c);
        translate(loop_noise*square_size/4, loop_noise*square_size/4)
        square(0,0, loop_noise*square_size/2);
      }
      pop();
    }
    pop();
  }

  pop();
  //cleanup
  apply_cutlines(bleed_border);

  capture_frame(capture);
}
//***************************************************
//custom funcs