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
  suggested_palette = random([SAGEANDCITRUS, SOUTHWEST, NURSERY]);
  common_setup(gif);
}
//***************************************************
function draw() {
  capture_start(capture);

  //bleed
  const bleed_border = apply_bleed();

  refresh_working_palette();
  strokeCap(random([PROJECT,ROUND]))

  //apply background
  const bg_c = random(working_palette)
  background(bg_c)
  reduce_array(working_palette, bg_c)

  //actual drawing stuff
  push();
  const linear_spread = floor(random([0, 2]))*global_scale;
  arcing(linear_spread);
  pop();
  //cleanup
  apply_cutlines(bleed_border);

  capture_frame(capture);
}
//***************************************************
//custom funcs
function arcing(linear_spread){
  push();
  noFill();
  translate(canvas_x/2, canvas_y/2);
  for(let i=0; i<291; i++){
    const offset = 10*global_scale;
    const step_size = global_scale;
    translate(random(0,linear_spread), random(0, linear_spread));
    
    const radius = (offset + step_size * i) * random(0.2, 3);
    stroke(random(palette));
    strokeWeight(random(1, 10)*global_scale);
    arc(0, 0, radius, radius, 0, random(45,300));
    rotate(random(0,360));
  }
  pop();
}


