'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 20;

const suggested_palettes = [];
let bg_c, weight, stroke_c;
function gui_values(){
  parameterize("num_cols", 20, 1, 50, 1, false);
  parameterize("layers", 3, 1, 10, 1, false);
  parameterize("num_lines", 5, 1, 10, 1, false);
} 

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();
  push();
  noFill();
  bg_c = png_bg(true);
  working_palette = controlled_shuffle(working_palette, true);
  strokeCap(PROJECT);
  const grid_step_size = round(canvas_x*2/num_cols);
  const num_rows = ceil(canvas_y*2/grid_step_size);
  translate(-canvas_x/2, -canvas_y/2);
  weight = PILOTPRECISEV5*global_scale;
  strokeWeight(weight);
  for(let k=0; k<layers; k++){
    push();
    translate(k*grid_step_size/2, k*grid_step_size/2);
    stroke_c = working_palette[k%working_palette.length];
    for(let i=0; i<num_cols; i++){
      for(let j=0; j<num_rows; j++){
        push();
  
        translate(i*grid_step_size, j*grid_step_size);
        truch(grid_step_size);
  
        pop();
      }
    }
    pop();
  }

  pop();  
  global_draw_end();
}
//***************************************************
//custom funcs
function truch(size){
  push();
  translate(size/2, size/2);
  rotate(random([0,90,180,270]));
  translate(-size/2, -size/2);

  if(random()>0.5){
    arcs(size, stroke_c);
    translate(size/2, size/2);
    rotate(180);
    translate(-size/2, -size/2);
    arcs(size, stroke_c);
  }
  else{
    lines(size, stroke_c);
    translate(size/2, size/2);
    rotate(90);
    translate(-size/2, -size/2);
    lines(size, stroke_c);
  }

  pop();
}

function lines(size, stroke_c){
  fill(bg_c);
  noStroke();
  rect(-weight/2, size/3-weight/2,size+weight/2, size/3+weight/2);

  stroke(stroke_c);
  line_blur(stroke_c, 1*global_scale);
  noFill();

  for(let i=0; i<=num_lines; i++){
    const lerp_size = size*lerp(4/3,2/3, i/num_lines);
    line(0, lerp_size/2, size, lerp_size/2);
  }
}

function arcs(size, stroke_c){
  fill(bg_c);
  stroke(bg_c);
  outline_arc(size);

  stroke(stroke_c);
  line_blur(stroke_c, 1*global_scale);
  noFill();

  for(let i=0; i<=num_lines; i++){
    const lerp_size = size/2*lerp(4/3,2/3, i/num_lines);
    draw_arc(lerp_size);
  }
}

function draw_arc(arc_size){
  const x1 = arc_size;
  const y4 = arc_size;
  let x2, y2, x3, y3;
  [x2, y2, x3, y3] = bezier_arc_controls(0,0, x1, 0, 0, y4);
  beginShape();
  bezier(x1, 0, x2, y2, x3, y3, 0, y4);
  endShape();
}

function outline_arc(size){
  beginShape();
  const small_size = size/3;
  let x1 = small_size;
  let y4 = small_size;
  let x2, y2, x3, y3;
  [x2, y2, x3, y3] = bezier_arc_controls(0,0, x1, 0, 0, y4);
  vertex(x1,0);
  bezierVertex(x2, y2, x3, y3, 0, y4);
  const large_size = size*2/3;
  x1 = large_size;
  y4 = large_size;
  [x2, y2, x3, y3] = bezier_arc_controls(0,0, x1, 0, 0, y4);
  vertex(0,y4);
  bezierVertex(x3, y3, x2, y2, x1, 0);
  endShape(CLOSE);
}