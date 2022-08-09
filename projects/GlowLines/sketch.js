'use strict';
//setup variables
const gif = true;
const fr = 30;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
let suggested_palette;

//project variables
let xoff = 0;
const inc = 0.005*60/fr;
const offset = 50
let bg_c;

function setup() {
  suggested_palette = random([SUMMERTIME, SOUTHWEST, JAZZCUP]);
  common_setup(gif);

  bg_c = random(palette)
}
//***************************************************
function draw() {
  capture_start(capture);

  //bleed
  const bleed_border = apply_bleed();

  let working_palette = JSON.parse(JSON.stringify(palette));

  //apply background
  background(bg_c)
  reduce_array(working_palette, bg_c)
  //actual drawing stuff
  push();

  noFill();
  strokeWeight(3*global_scale);
  translate(canvas_x/2, canvas_y/2);
  //shadow
  drawingContext.shadowBlur = noise(xoff)*global_scale*10;

  for(let i=0; i<map(noise(xoff), 0, 1, 10, 110); i++){
    const c = color(working_palette[i%Math.min(3, working_palette.length)])
    drawingContext.shadowColor = c;
    stroke(c)
    circle(0,0, map(noise(xoff+offset*i), 0, 1, -100, 600)*global_scale);
  }  

  xoff += inc;
  pop();
  noFill();
  
  // erase();
  stroke('#eeede9')
  cutoutCircle(canvas_y/128);
  noErase();
  //cutlines
  apply_cutlines(bleed_border);

  capture_frame(capture);
}
//***************************************************
//custom funcs




