'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

let x_fourth, y_fourth, copic_palette;
const suggested_palettes = [SUMMERTIME, SOUTHWEST, SIXTIES, JAZZCUP];

function gui_values(){
  parameterize("num_lines", floor(random(50,200)), 1, 200, 1, false);
  parameterize("weight", random(10,30), 1, 40, 0.1, true);
  parameterize("sin_mult", random(5,20), 1, 50, 0.1, false);
} 

function setup() {
  common_setup();
  gui_values();
  // pixelDensity(15);
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  set_linear_gradient(working_palette.slice(0,round(random(2,working_palette.length))), canvas_x/2, 0, canvas_x/2, canvas_y, "fill");
  // background("BLACK");
  rect(0,0,canvas_x, canvas_y);
  // blendMode(LIGHTEST);
  translate(0,weight/2);
  strokeWeight(weight);
  const step_size = canvas_y/num_lines;
  const sin_offset = random(360);
  for(let i=0; i<num_lines; i++){
    push();
    if(random()>0.6) drawingContext.setLineDash([floor(random(0,30))*global_scale, floor(random(10,50))*global_scale]);
    else drawingContext.setLineDash([]);
    const c = color(random(working_palette));
    translate(0, i * step_size);
    // rotate(random(1))
    c.setAlpha(map(sin(sin_offset + i*sin_mult),-1,1,200,255));
    drawingContext.shadowColor = c;
    drawingContext.shadowBlur = map(sin(sin_offset + i*sin_mult), -1,1, 0,5)*global_scale;
    drawingContext.filter = "brightness("+ map(sin(sin_offset + i*sin_mult), -1,1, 0,200)+"%)";
    stroke(c);
    if(i%2==0) blendMode(MULTIPLY);
    line(0,0,canvas_x,0);
    pop();
  }
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
