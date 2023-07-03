'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 30;
const capture = false;
const capture_time = 10;


function gui_values(){
  parameterize("noise_off", 20, 0, 200, 1, false);
  parameterize("inc", 0.6, 0.01, 1.5, 0.01, false);
  parameterize("sym_angs", floor(random(4,17)), 1, 30, 1, false);
  parameterize("line_segs", floor(random(5,15)), 3, 30, 1, false);
  parameterize("len", random(6, 25), 1, 50, 1, false);
  parameterize("tightness", 0, -5, 5, 0.1, false);
}

function setup() {
  common_setup(8*96, 8*96, SVG);
}
//***************************************************
function draw() {
  global_draw_start();

  push();
  noFill();
  strokeWeight(1*global_scale);
  const colors = gen_n_colors(sym_angs);
  curveTightness(tightness);

  translate(canvas_x/2, canvas_y/2);

  //actual drawing stuff
  for(let i=0; i<sym_angs; i++){
    stroke(colors[i]);
    let xoff = 0;
    for(let z=0; z<len; z++){
        push();
        beginShape();
        for(let j=0; j<line_segs; j++){
          const dampening = map(noise(j), 0, 1, 10, 100);
          const x = floor(map(noise((j + xoff)/dampening), 0, 1, -canvas_x*.5, canvas_x*.5));
          const y = floor(map(noise((j + xoff + noise_off)/dampening), 0,1, -canvas_y*.5, canvas_y*.5));
          if(j == 0){
            curveVertex(x, y);
          }
          curveVertex(x, y);
        }
        endShape();
        pop();

      xoff+= inc;
    }
    rotate(360/sym_angs);
  }
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
