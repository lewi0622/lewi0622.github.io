'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 5;

const suggested_palettes = []

//project variables
const inc = 0.15*60/fr;
let xoff;

function gui_values(){
  parameterize("sym_angs", floor(random(6,49)), 1, 100, 1, false);
  parameterize("line_segs", floor(random(20,51)), 5, 100, 1, false);
  parameterize("dampening", random(30,80), 1, 500, 1, false);
  parameterize("noise_off", random(-20,20), -100, 100, 1, false);
  parameterize("weight", random(1,3), 1, 10, 0.1, true);
}

function setup() {
  common_setup();
  gui_values();
  dampening = 50;
  xoff = 0
  line_segs = floor(random(20,51));
  const line_color = color("WHITE");
  //shadow/glow
  drawingContext.shadowBlur=3*global_scale;
  drawingContext.shadowColor = line_color;
  stroke(line_color);
  noFill();
  document.body.style.background = "BLACK";
  pixelDensity(2);
}
//***************************************************
function draw() {
  global_draw_start();
  strokeWeight(weight);
 
  translate(canvas_x/2, canvas_y/2);

  const [x_off, y_off] = noise_loop_2d(fr, capture_time, 1);

  const pts = [];
  for(let j=0; j<line_segs; j++){
    const x = floor(map(noise((j )/dampening, x_off, y_off), 0, 1, -canvas_x*.75, canvas_x*.75));
    const y = floor(map(noise((j + noise_off)/dampening, x_off, y_off), 0,1, -canvas_y*.75, canvas_y*.75));
    pts.push({x:x, y:y});
  }

  for(let i=0; i<sym_angs; i++){
      beginShape();
      for(let j=0; j<pts.length; j++){
        curveVertex(pts[j].x, pts[j].y);
      }
      endShape();
    rotate(360/sym_angs);
  }

  xoff+= inc;
  
  global_draw_end();
}