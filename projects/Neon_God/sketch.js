'use strict';
//setup variables
const gif = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
let suggested_palette;

function setup() {
  suggested_palette = random([SOUTHWEST, SIXTIES, JAZZCUP]);
  common_setup(gif);
}
//***************************************************
function draw() {
  capture_start(capture);
  //bleed
  const bleed_border = apply_bleed();

  let working_palette = JSON.parse(JSON.stringify(palette));

  //apply background
  background(random(['RED', 'GREEN', 'BLUE']));
  let bg_c = random(working_palette);
  reduce_array(working_palette, bg_c);
  bg_c = color(bg_c);
  bg_c.setAlpha(150);
  fill(bg_c);
  rect(0,0, canvas_x, canvas_y);

  //actual drawing stuff
  push();

  let c=random(working_palette);
  reduce_array(working_palette,c);
  c = color(c);
  c.setAlpha(floor(random(3,10)));
  noStroke();
  fill(c);
  for(let i=0; i<1000; i++){
    circle(random(-canvas_x/2, canvas_x*1.5), random(-canvas_y/2, canvas_y*1.5), canvas_x/2);
  }

  c=color(random(working_palette));
  translate(canvas_x/2, canvas_y/2);

  drawingContext.filter = 'brightness('+floor(random(250,500))+'%)';
  c.setAlpha(255);
  strokeWeight(global_scale);
  drawingContext.shadowBlur=10*global_scale;
  drawingContext.shadowColor = c;
  stroke(c);
  noFill();

  const sym_angs = round(random(20,20));
  rotate(360/sym_angs*ceil(random(sym_angs)));
  let rad = random(canvas_x/4, canvas_x/2);
  let offset_me, offset;
  if(sym_angs%2==0){
    offset_me = true;
    offset = random(canvas_x/8);
  }
  else{
    offset_me = false;
  }

  const x_offset = random(canvas_x/16, canvas_x/8);
  const shape = random(["CIR", "SQ"]);
  let cornering;
  if(random()>0.5) cornering = random(rad/8)*global_scale;
  if(shape == "SQ") rad = random(rad/2, rad);
  for(let i=0; i<sym_angs; i++){
    rotate(360/sym_angs);
    if(i%2==0 && offset_me){
      if(shape=="CIR") circle(x_offset+offset, 0, rad);
      else if(shape=="SQ") square(x_offset+offset-rad/2, -rad/2, rad, cornering);
    }
    else{
      if(shape=="CIR") circle(x_offset, 0, rad);
      else if(shape=="SQ") square(x_offset-rad/2, -rad/2, rad, cornering);
    }
  }
  if(shape=="CIR"){
    if(offset_me) circle(0,0, rad+(x_offset+offset)*2);
    else circle(0,0, rad+x_offset*2);
  }
  
  filter(OPAQUE)

  pop();
  //cutlines
  apply_cutlines(bleed_border);
  capture_frame(capture);
}
//***************************************************
//custom funcs