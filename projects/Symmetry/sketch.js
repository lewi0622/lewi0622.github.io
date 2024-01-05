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
const inc = 0.3*60/fr;
let xoff, sym_angs, line_segs, len, line_color;


function gui_values(){

}

function setup() {
  common_setup();

  //start drawing over if autoscaled
  xoff = 0;

  //apply background
  sym_angs = floor(random(4,17));
  line_segs = floor(random(5,15));
  background("BLACK");
  drawingContext.shadowBlur=1*global_scale;

  len = round(800/(line_segs*constrain(sym_angs, 4,8)));

  line_color = color(random(palette));
  drawingContext.shadowColor = line_color
  stroke(line_color);
  noFill();
  strokeWeight(1.5*global_scale);
  loop();
}
//***************************************************
function draw() {
  global_draw_start(false);

  //actual drawing stuff
  push();
  translate(canvas_x/2, canvas_y/2);
  for(let i=0; i<sym_angs; i++){
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
      endShape(CLOSE);
    pop();
    rotate(360/sym_angs);
  }

  xoff+= inc;

  pop();

  //stop drawing
  if(frameCount>len){
    noLoop();
  }
  
  global_draw_end();
}
//***************************************************
//custom funcs