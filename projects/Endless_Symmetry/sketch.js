'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 10;

const suggested_palettes = []

//project variables
const noise_off = 20;
const inc = 0.1*60/fr;
let xoff, sym_angs, line_segs, line_color


function gui_values(){

}

function setup() {
  common_setup();
  gui_values();

  xoff = 0;

  //apply background
  sym_angs = random([4,6,8,10,12,14,16]);
  line_segs = floor(random(5,20));
  line_color = color(random(palette));
  drawingContext.shadowBlur=3*global_scale;
  drawingContext.shadowColor = line_color;
  stroke(line_color);
}
//***************************************************
function draw() {
  global_draw_start();

  background("BLACK");


  //actual drawing stuff
  push();
  for(let i=0; i<sym_angs; i++){
    push();
      translate(canvas_x/2, canvas_y/2);
      noFill();
      strokeWeight(1.5*global_scale);
      curveTightness(map(noise(xoff/100), 0, 1, -5, 5));
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

  xoff+= inc;

  pop();
  global_draw_end();
}