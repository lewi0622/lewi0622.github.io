'use strict';
//setup variables
let gif = true;
let animation = true;
const fr = 30;
const capture = false;
const capture_time = 10;

const suggested_palettes = []

//project variables
const noise_off = 20;
const inc = 0.1*60/fr;
let xoff, line_color;

function gui_values(){
  parameterize("sym_angs", round(random(2,8)), 2, 20, 1, false);
  parameterize("line_segs", floor(random(10,30)), 4, 30, 1, false);
}

function setup() {
  common_setup();
  gui_values();

  xoff = 0;

  line_color = color("WHITE");
  drawingContext.shadowBlur=3*global_scale;
  drawingContext.shadowColor = line_color;
  stroke(line_color);
  document.body.style.background = "BLACK";
  noFill();
  strokeWeight(1.5*global_scale);
  pixelDensity(2);
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  const [x_off, y_off] = noise_loop_2d(fr, capture_time, 1);
  curveTightness(map(pnoise.simplex2(x_off, y_off), -1, 1, -5, 5));
  translate(canvas_x/2, canvas_y/2);

  const pts = [];
  for(let j=0; j<line_segs; j++){
    const dampening = map(noise(j), 0, 1, 10, 100);
    const x = floor(map(pnoise.simplex3(j/dampening, x_off, y_off), -1, 1, -smaller_base*global_scale/3, smaller_base*global_scale/3));
    const y = floor(map(pnoise.simplex3((j + noise_off)/dampening, x_off, y_off), -1,1, -smaller_base*global_scale/3, smaller_base*global_scale/3));
    pts.push({x:x, y:y});
  }

  for(let i=0; i<sym_angs; i++){
    rotate(360/sym_angs);

    beginShape();
    for(let j=0; j<pts.length; j++){
      const pt = pts[j];
      curveVertex(pt.x, pt.y);
    }
    endShape();
  }
  xoff+= inc;

  global_draw_end();
}