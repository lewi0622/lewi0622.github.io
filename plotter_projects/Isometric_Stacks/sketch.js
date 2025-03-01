'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 8;

function gui_values(){
  parameterize("num_stacks", 50, 1, 200, 1, false);
}

function setup() {
  common_setup();
  gui_values();

}
//***************************************************
function draw() {
  global_draw_start();
  //actual drawing stuff
  push();
  stroke("BLUE")
  rect(0,0,canvas_x, canvas_y);

  rectMode(CENTER);
  const weight = LEPEN * global_scale;
  strokeWeight(weight);
  const c = color("BLACK");
  c.setAlpha(100);
  stroke(c);
  translate(canvas_x/2, canvas_y + 10 * global_scale);

  for(let j=0; j<num_stacks; j++){
    push();
    const x = random(-canvas_x/2 + 10 * global_scale, canvas_x/2 - 10 * global_scale);
    translate(x,0);
    const num_shapes = noise(j/100, x/global_scale/100) * lerp(canvas_y/weight * 3,0,j/num_stacks);
    for(let i=0; i<num_shapes; i++){
      push();
      translate(0, -weight/2 * i);
      isometric_tile();
      pop();
    }
    pop();
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs

function isometric_tile(size=10*global_scale){
  const w = size;
  const h = size/2;
  beginShape();
  vertex(0,0);
  vertex(-w/2, -h/2);
  vertex(0,-h);
  vertex(w/2,-h/2);
  endShape(CLOSE);
}


