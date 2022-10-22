'use strict';
//setup variables
const gif = false;
const fr = 5;
const capture = false;
const capture_time = 2;
const sixteen_by_nine = false;
let suggested_palette, working_palette, grid_bg_c;

function setup() {
  suggested_palette = random([BIRDSOFPARADISE, NURSERY, SIXTIES, JAZZCUP]);
  common_setup(gif);
}
//***************************************************
function draw() {
  capture_start(capture);
  //bleed
  const bleed_border = apply_bleed();

  working_palette = JSON.parse(JSON.stringify(palette));
  //actual drawing stuff
  push();
  let grid_size = 400*global_scale;
  let num_cols = floor(canvas_y/grid_size);
  let num_rows = floor(canvas_x/grid_size);
  num_cols = constrain(num_cols,1,num_cols);
  num_rows = constrain(num_rows,1,num_cols);
  if(canvas_y<canvas_x) grid_size = canvas_y/num_cols;
  else grid_size = canvas_x/num_rows;
  num_rows = floor(canvas_x/grid_size);
  num_cols = floor(canvas_y/grid_size);
  
  translate((canvas_x-grid_size*num_rows)/2, (canvas_y-grid_size*num_cols)/2);

  const wobble_x = grid_size/8;
  const wobble_y = grid_size/12;
  const num_arcs = 2;
  const arc_size = grid_size/3;
  if(frameCount==1){
    grid_bg_c = random(working_palette);
  }
  background(grid_bg_c);
  strokeWeight(grid_size/20);
  for(let col=0; col<num_cols; col++){
    for(let row=0; row<num_rows; row++){
      push();
      translate(row*grid_size+grid_size/2, col*grid_size+grid_size/2);
      rotate(random(360));
      for(let i=0; i<num_arcs; i++){
        push();
        rotate(360/num_arcs*i);
        translate(random(wobble_x), random(wobble_y));
        working_palette = JSON.parse(JSON.stringify(palette));
        reduce_array(working_palette, grid_bg_c);
        let dir = "LEFT";
        if(i!=0){
          dir = "RIGHT";
        }
        slices(arc_size, dir);
        pop();
      }
      pop();
    }
  }
  pop();

  //cutlines
  apply_cutlines(bleed_border);
  capture_frame(capture);
}
//***************************************************
//custom funcs
function slices(rad, dir){
  const c1 = random(working_palette);
  reduce_array(working_palette, c1);
  const c2 = random(working_palette);
  const clear = color(c1);
  clear.setAlpha(0);
  const fill_gradient = drawingContext.createLinearGradient(0,0, rad,0);
  fill_gradient.addColorStop(0,color(c1));
  fill_gradient.addColorStop(0.9,color(clear));
  push();
  noStroke();
  drawingContext.fillStyle = fill_gradient;
  beginShape();
  vertex(rad,0);
  bezierVertex(random(-rad,rad),rad, -random(-rad,rad),rad, -rad,0); //first control point, second control point, endpoint
  endShape();
  pop();

  noFill();
  stroke(c2);
  drawingContext.shadowBlur=2*global_scale;
  drawingContext.shadowColor = color(c2);
  translate(0, rad*0.1);
  rad *=0.8;
  beginShape();
  vertex(rad,0);
  bezierVertex(random(-rad,rad),rad, -random(-rad,rad),rad, -rad,0); //first control point, second control point, endpoint
  endShape();
}
