'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 10;

const suggested_palettes = [SUMMERTIME, SOUTHWEST, JAZZCUP]

function gui_values(){
  parameterize("num_circles", floor(random(20, 100)), 1, 200, 1, false);
  parameterize("weight", 3, 1, 10, 1, true);
}

function setup() {
  common_setup();
  gui_values();

  working_palette = controlled_shuffle(working_palette, true);

  pixelDensity(2);
}
//***************************************************
function draw() {
  global_draw_start();

  translate(canvas_x/2, canvas_y/2);
  noFill();
  strokeWeight(weight);

  const [xoff, yoff] = noise_loop_2d(fr, capture_time, 1);

  drawingContext.shadowBlur = map(pnoise.simplex2(xoff, yoff), -1,1, 2, 10) * global_scale;

  for(let i=0; i<num_circles; i++){
    const c = color(working_palette[i%Math.min(3, working_palette.length)])
    drawingContext.shadowColor = c;
    stroke(c)
    const diameter = map(pnoise.simplex3(xoff, yoff, i), -1, 1, -smaller_base/4, smaller_base-weight)*global_scale
    circle(0,0, diameter);
  }  
  
  global_draw_end();
}
//***************************************************
//custom funcs




