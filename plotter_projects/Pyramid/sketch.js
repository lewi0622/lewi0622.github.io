'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
suggested_palettes = [BUMBLEBEE]


function gui_values(){

}

function setup() {
  common_setup(gif, SVG);
}
//***************************************************
function draw() {  
  capture_start(capture);

  //bleed
  const bleed_border = apply_bleed();

  refresh_working_palette();
  strokeCap(SQUARE)
  strokeWeight(COPICMARKER);
  noFill();
  //apply background
  let bg_c = working_palette[1]; //white
  background(bg_c)
  
  //actual drawing stuff
  push();

  //generate arc values
  const arcs = arcing();

  //draw half the arc
  push();
  translate(canvas_x/2, canvas_y/2);
  rotate(120);
  stroke(working_palette[0]);
  arcs.forEach(e => {
    strokeWeight(random(COPICMARKER, COPICMARKER*2))
    arc(0, 0, e.radius, e.radius, 0, e.angle);
  });
  pop();

  const pyramid = working_palette[2]; //yellow

  stroke(pyramid);
  translate(canvas_x/2, canvas_y/2);
  const leg = (canvas_y/2)/cos(30);
  const hyp = leg * sin(30);
  triangle(0,0, hyp,canvas_y/2, -hyp,canvas_y/2);
  pop();



  // clean up pyramid
  // push();
  // noStroke();
  // fill(pyramid);
  // translate(canvas_x/2, canvas_y/2);
  // const pyr_dist = 10*global_scale;
  // beginShape();
  // vertex(0,0);
  // vertex(0,pyr_dist);
  // vertex(-hyp+pyr_dist,canvas_y/2);
  // vertex(-hyp,canvas_y/2);
  // endShape();
  // pop();

  //cutlines
  apply_cutlines(bleed_border);

  capture_frame(capture);
}
//***************************************************
//custom funcs
function arcing(){
  // push();
  // noFill();
  // translate(canvas_x/2, canvas_y/2);
  // rotate(120);
  const arcs = [];
  const arc_offset = 100*global_scale;
  const arc_step = global_scale;
  const arc_max = 100;
  for(let i=0; i<arc_max; i++){
    const radius = (i*arc_step + arc_offset) * random(0.2, 2);
    // stroke(working_palette[0]);
    arcs.push({radius:radius, angle:random(150,330)})
    // arc(0, 0, radius, radius, 0, random(150,330));
  }
  // pop();
  return arcs;
}



