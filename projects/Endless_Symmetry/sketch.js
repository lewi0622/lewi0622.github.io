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
  parameterize("sym_angs", round(random(2,8)), 3, 20, 1, false);
  parameterize("line_segs", floor(random(10,30)), 3, 30, 1, false);
  if(type == "svg"){
    parameterize("svg_xoff", 0, 0, 200, 0.1, false);
    parameterize("tightness", random(-5,5), -5, 5, 0.1, false);
  }
}

function setup() {
  common_setup();
  gui_values();

  xoff = 0;

  if(type == "png"){
    line_color = color(random(palette));
    drawingContext.shadowBlur=3*global_scale;
    drawingContext.shadowColor = line_color;
    stroke(line_color);
  }
  else{
    gif = false;
    animation = false;
    noLoop();
  }
}
//***************************************************
function draw() {
  global_draw_start();

  if(type == "png")background("BLACK");
  else xoff = svg_xoff;

  //actual drawing stuff
  push();
  for(let i=0; i<sym_angs; i++){
    push();
      translate(canvas_x/2, canvas_y/2);
      noFill();
      strokeWeight(1.5*global_scale);
      if(type == "png") curveTightness(map(noise(xoff/100), 0, 1, -5, 5));
      else curveTightness(tightness);
      beginShape();
      for(let j=0; j<line_segs; j++){
        const dampening = map(noise(j), 0, 1, 10, 100);
        const x = floor(map(noise((j + xoff)/dampening), 0, 1, -smaller_base*global_scale*.75, smaller_base*global_scale*.75));
        const y = floor(map(noise((j + xoff + noise_off)/dampening), 0,1, -smaller_base*global_scale*.75, smaller_base*global_scale*.75));
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