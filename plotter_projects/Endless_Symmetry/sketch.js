'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 30;

const noise_off = 20;

const capture = false;
const capture_time = 5

function gui_values(){
  parameterize("sym_angs", round(random(2,8)), 3, 20, 1, false);
  parameterize("line_segs", floor(random(10,30)), 3, 30, 1, false);
  parameterize("xoff", 0, 0, 200, 0.1, false);
  parameterize("tightness", random(-5,5), -5, 5, 0.1, false);
}

function setup() {
  common_setup();
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  for(let i=0; i<sym_angs; i++){
    push();
      translate(canvas_x/2, canvas_y/2);
      noFill();
      strokeWeight(1.5*global_scale);
      curveTightness(tightness);
      beginShape();
      for(let j=0; j<line_segs; j++){
        const dampening = map(noise(j), 0, 1, 10, 100);
        const x = floor(map(noise((j + xoff)/dampening), 0, 1, -canvas_x*.75, canvas_x*.75));
        const y = floor(map(noise((j + xoff + noise_off)/dampening), 0,1, -canvas_y*.75, canvas_y*.75));
        if(j == 0){
          curveVertex(x, y);
        }
        curveVertex(x, y);
      }
      endShape();
    pop();
    center_rotate(360/sym_angs);

  }

  pop();

  global_draw_end();
}