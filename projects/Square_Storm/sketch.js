'use strict';
//setup variables
const gif = true;
const fr = 30;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
let suggested_palette;

//project variables
const squares = [];
const num_squares = 1000;
let ang = 0;
const ang_inc = 1;
let origin;

function setup() {
  suggested_palette = random([SUMMERTIME, SOUTHWEST, NURSERY, JAZZCUP]);
  common_setup(gif);
  for(let i=0; i<num_squares; i++){
    const c = color(random(palette));
    c.setAlpha(0.05*255);
    squares.push({x:random(-canvas_x/8, canvas_x*9/8), y:random(-canvas_y/8, canvas_y*9/8), c: c});
  }
  //rotation point
  origin = random(["tl", "tr", "center", "bl", "br"]);
}
//***************************************************
function draw() {
  clear();
  capture_start(capture);
  //bleed
  const bleed_border = apply_bleed();

  let working_palette = JSON.parse(JSON.stringify(palette));

  //apply background
  background("WHITE");

  noStroke();
  //actual drawing stuff
  push();
  const shape_size = 200*global_scale;
  const corner = 20*global_scale;

  switch(origin){
    case "br":
      translate(canvas_x, canvas_y);
      break;
    case "bl":
      translate(0, canvas_y);
      break;
    case "center":
      translate(canvas_x/2, canvas_y/2);
      break;
    case "tr":
      translate(canvas_x, 0);
      break;
    default:
      break;
  }

  for(let i=0; i<num_squares; i++){
    push();
    rotate(ang+i);
    translate(squares[i].x, squares[i].y);
    rotate(-ang);
    fill(squares[i].c);
    square(0,0, shape_size+map(noise((i+ang)/100), 0,1, -shape_size/4,shape_size/4), corner, corner, corner, corner);
    pop();
  }
  ang += ang_inc;
  pop();
  //cutlines
  apply_cutlines(bleed_border);
  capture_frame(capture);
}
//***************************************************
//custom funcs
