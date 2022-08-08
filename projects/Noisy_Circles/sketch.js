'use strict';
//setup variables
const gif = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
let suggested_palette;

function setup() {
  suggested_palette = random([SAGEANDCITRUS, SUMMERTIME, SOUTHWEST]);
  common_setup(gif);
}
//***************************************************
function draw() {
  capture_start(capture);
  //bleed
  const bleed_border = apply_bleed();

  let working_palette = JSON.parse(JSON.stringify(palette));

  //apply background
  background("WHITE")
  const bg_c = color(random(working_palette));
  reduce_array(working_palette, bg_c);
  bg_c.setAlpha(150);
  background(bg_c);


  //actual drawing stuff
  push();

  let c=color(random(working_palette));
  reduce_array(working_palette,c)
  stroke(c);
  noFill();
  strokeWeight(global_scale*0.01);
  for(let i=0; i<60000; i++){
    circle(random(-canvas_x/2, canvas_x*1.5), random(-canvas_y/2, canvas_y*1.5), canvas_x/2);
  }

  c=color(random(working_palette));
  translate(canvas_x/2, canvas_y/2);

  c.setAlpha(150);
  strokeWeight(global_scale);
  stroke(c);
  c.setAlpha(50);
  fill(c);


  drawingContext.filter = 'brightness(110%)';
  const sym_angs = round(random(6,32));
  const rad = random(canvas_x/4, canvas_x/2);
  let offset_me, offset;
  if(sym_angs%2==0){
    offset_me = true;
    offset = random(canvas_x/8);
  }
  else{
    offset_me = false;
  }
  const x_offset = random(canvas_x/8, canvas_x/4);
  for(let i=0; i<sym_angs; i++){
    rotate(360/sym_angs);
    if(i%2==0 && offset_me){
      circle(x_offset+offset, 0, rad);
    }
    else{
      circle(x_offset, 0, rad);
    }
  }
  
  pop();
  //cutlines
  apply_cutlines(bleed_border);
  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs




