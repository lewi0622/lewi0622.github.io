'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 30;
const capture = false;
const capture_time = 15;

//project variables
const noise_off = 20;

function gui_values(){
  parameterize("xoff_coarse", 0, 0, 100, 10, false);
  parameterize("xoff_fine", 0, 0, 10, 0.2, false);
}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();

  const sym_angs = floor(random(6,49));
  const line_segs = floor(random(20,51));

  stroke("BLACK");

  //actual drawing stuff
  push();
  rectMode(CENTER);
  translate(canvas_x/2, canvas_y/2);
  noFill();
  stroke("RED")
  rect(0,0, 380*global_scale, 380*global_scale)
  pop();
  push();
  let xoff = xoff_coarse + xoff_fine;
  for(let i=0; i<sym_angs; i++){
    push();
      translate(canvas_x/2, canvas_y/2);
      noFill();
      strokeWeight(1*global_scale);

      beginShape();
      for(let j=0; j<line_segs; j++){
        let dampening = 50;
        let x = floor(map(noise((j + xoff)/dampening), 0, 1, -canvas_x*.75, canvas_x*.75));
        let y = floor(map(noise((j + xoff + noise_off)/dampening), 0,1, -canvas_y*.75, canvas_y*.75));
        if(j == 0){
          curveVertex(x, y);
        }
        curveVertex(x, y);
      }
      endShape();
    pop();
    center_rotate(360/sym_angs);
  }

  xoff+= inc;

  pop();
  global_draw_end();
}