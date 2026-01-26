'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 10;

const suggested_palettes = []

//project variables
let pts;

function gui_values(){
  parameterize("sym_angs", floor(random(6,49)), 1, 100, 1, false);
  parameterize("line_segs", floor(random(20,51)), 5, 100, 1, false);
  parameterize("dampening", random(30,80), 1, 500, 1, false);
  parameterize("noise_off", random(-20,20), -100, 100, 1, false);
  parameterize("weight", random(1,3), 1, 10, 0.1, true);
  parameterize("radius", smaller_base/2, 0, larger_base, 1, true);
}

function setup() {
  common_setup();
  gui_values();

  const line_color = color("WHITE");
  //shadow/glow
  drawingContext.shadowBlur=3*global_scale;
  drawingContext.shadowColor = line_color;
  stroke(line_color);
  noFill();

  pts = [];
  for(let i=0; i<line_segs; i++){
    frameCount = fr * capture_time - (line_segs-i);
    const [x,y] = create_pt();
    pts.push({x:x, y:y});
  }
  frameCount = 0;

  document.body.style.background = "BLACK";
  pixelDensity(2);
}
//***************************************************
function draw() {
  global_draw_start();
  strokeWeight(weight);
  // background("BLACK")
  translate(canvas_x/2, canvas_y/2);

  rotate(angle_loop(fr, capture_time, 2));

  for(let i=0; i<sym_angs; i++){
      beginShape();
      for(let j=0; j<pts.length; j++){
        curveVertex(pts[j].x, pts[j].y);
      }
      endShape();
    rotate(360/sym_angs);
  }

  const [x,y] = create_pt();
  pts.push({x:x, y:y});
  pts.shift();
  
  global_draw_end();
}

function create_pt(){
    const [x_off, y_off] = noise_loop_2d(fr, capture_time, 0.8);
    const x = floor(map(noise(1/dampening, x_off, y_off), 0, 1, -radius, radius));
    const y = floor(map(noise(noise_off/dampening, x_off, y_off), 0,1, -radius, radius));
    return [x,y];
}