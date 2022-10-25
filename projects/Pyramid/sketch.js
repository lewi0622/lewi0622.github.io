'use strict';
//setup variables
const gif = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
let suggested_palette, working_palette;

let gui_params = [];

function gui_values(){

}

function setup() {
  suggested_palette = random([COTTONCANDY, BUMBLEBEE, SOUTHWEST]);
  common_setup(gif);
}
//***************************************************
function draw() {  
  capture_start(capture);

  //bleed
  const bleed_border = apply_bleed();

  working_palette = JSON.parse(JSON.stringify(palette));
  strokeCap(ROUND)

  //apply background
  let bg_c = random(working_palette)
  background(bg_c)
  reduce_array(working_palette, bg_c)
  
  //actual drawing stuff
  push();
  const pyramid = random(working_palette)
  reduce_array(working_palette, pyramid);

  noStroke();
  fill(pyramid);
  translate(canvas_x/2, canvas_y/2);
  const leg = (canvas_y/2)/cos(30);
  const hyp = leg * sin(30);
  triangle(0,0, hyp,canvas_y/2, -hyp,canvas_y/2);
  pop();

  arcing();

  // clean up pyramid
  push();
  noStroke();
  fill(pyramid);
  translate(canvas_x/2, canvas_y/2);
  const pyr_dist = 10*global_scale;
  beginShape();
  vertex(0,0);
  vertex(0,pyr_dist);
  vertex(-hyp+pyr_dist,canvas_y/2);
  vertex(-hyp,canvas_y/2);
  endShape();
  pop();

  //cutlines
  apply_cutlines(bleed_border);

  capture_frame(capture);
}
//***************************************************
//custom funcs
function arcing(){
  push();
  noFill();
  translate(canvas_x/2, canvas_y/2);
  rotate(120);

  const arc_offset = 100*global_scale;
  const arc_step = global_scale;
  const arc_max = 100;
  for(let i=0; i<arc_max; i++){
    const radius = (i*arc_step + arc_offset) * random(0.2, 2);
    stroke(random(working_palette));

    strokeWeight(random(1, 10)*global_scale)

    arc(0, 0, radius, radius, 0, random(150,330));
  }
  pop();
}


