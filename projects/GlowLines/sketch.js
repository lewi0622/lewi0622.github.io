'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 10;

suggested_palettes = [SUMMERTIME, SOUTHWEST, JAZZCUP]

//project variables
const inc = 0.005*60/fr;
const offset = 50
let xoff, bg_c;


function gui_values(){

}

function setup() {
  common_setup();

  xoff = 0;
  bg_c = random(palette)
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();

  //apply background
  background(bg_c)
  reduce_array(working_palette, bg_c)
  //actual drawing stuff
  push();

  noFill();
  strokeWeight(3*global_scale);
  translate(canvas_x/2, canvas_y/2);
  //shadow
  drawingContext.shadowBlur = noise(xoff)*global_scale*10;

  for(let i=0; i<map(noise(xoff), 0, 1, 10, 110); i++){
    const c = color(working_palette[i%Math.min(3, working_palette.length)])
    drawingContext.shadowColor = c;
    stroke(c)
    circle(0,0, map(noise(xoff+offset*i), 0, 1, -100, 600)*global_scale);
  }  

  xoff += inc;
  pop();
  noFill();
  
  // erase();
  stroke('#eeede9')
  cutoutCircle(canvas_y/128);
  noErase();
  
  global_draw_end();
}
//***************************************************
//custom funcs




