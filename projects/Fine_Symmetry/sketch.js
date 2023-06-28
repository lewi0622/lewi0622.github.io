'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
suggested_palettes = []

//project variables
const noise_off = 20;
// const inc = 0.3*60/fr;
const inc = 0.18;
let xoff = 0;
let sym_angs, line_segs, len, line_color;


function gui_values(){
  parameterize("redraw_times", 2, 1, 10, 1, false);
  parameterize("weight", random(0.01, 0.05), 0.01, 10, 0.01, true);
}

function setup() {
  common_setup();

  //start drawing over if autoscaled
  xoff = 0;
  frameCount = 0;
  //apply background
  sym_angs = floor(random(4,17));
  line_segs = floor(random(5,15));
  background("BLACK");
  drawingContext.shadowBlur=2*global_scale;

  len = 800/(line_segs*constrain(sym_angs, 4,8));
  len *= map(constrain(weight, 0, 1), 0,1, 25, 1);
  len = floor(len);

  line_color = color(random(palette));
  drawingContext.shadowColor = line_color
  stroke(line_color);
  noFill();
  strokeWeight(weight);
}
//***************************************************
function draw() {
  global_draw_start(false);

  //actual drawing stuff
  push();
  translate(canvas_x/2, canvas_y/2);
  for(let i=0; i<sym_angs; i++){
    push();
    for(let z=0; z<redraw_times; z++){
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
    }
    pop();
    rotate(360/sym_angs);
  }

  xoff+= inc;

  pop();

  if(frameCount>len) noLoop();  //stop drawing
  
  global_draw_end();
}
//***************************************************
//custom funcs