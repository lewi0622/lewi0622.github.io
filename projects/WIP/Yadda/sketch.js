'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 30;
const capture = false;
const capture_time = 10;

const suggested_palettes = [TOYBLOCKS, COTTONCANDY, SUMMERTIME];
let colors, bg_c;

function gui_values(){
  parameterize("iterations", random([5,10,15,20,50]), 1, 500, 1, false);
  parameterize("min_width", 0, 0, 100, 1, true);
  parameterize("max_width", 100, 0, 200, 1, true);
  parameterize("blur_size", 1, 0, 5, 0.1, true);
  parameterize("slides", 100, 1, 1000, 1, false);
}

function setup() {
  common_setup();
  gui_values();
  rectMode(CENTER);
  colors = [];
  for(let i=0; i<working_palette.length; i++){
    const c = color(working_palette[i]);
    c.setAlpha(255);
    colors.push(c);
  }
  bg_c = random(working_palette);
  background(bg_c);
  noStroke();
}
//***************************************************
function draw() {
  global_draw_start(false);
  push();

  const lips = [];
  for(let j=0; j<iterations; j++){
    const x = random(canvas_x/2);
    const y = random(canvas_y/2);
    const w = random(min_width, lerp(max_width, max_width/2, j/iterations));
    const h = random(w,canvas_x/2);

    let c = random(colors);

    lips.push({
      x:x,
      y:y,
      w:w,
      h:h,
      c:c
    });
  }

  for(let j=0; j<iterations; j++){
    if(j%4==0)blendMode(MULTIPLY);
    else if(j%4==1) blendMode(SCREEN);
    else blendMode(BLEND);
    const lip = lips[j];
    fill(lip.c);
    line_blur(lip.c,lerp(blur_size,0,j/iterations));
    for(let i=0; i<4; i++){
      push();
      if(i==0){
        translate(lip.x,lip.y);
        rotate(atan2(canvas_y/2-lip.y,canvas_x/2-lip.x));
      }
      else if(i==1){
        translate(canvas_x-lip.x, lip.y);
        rotate(atan2(canvas_y/2-lip.y, lip.x-canvas_x/2));
      }
      else if(i==2){
        translate(lip.x, canvas_y-lip.y);
        rotate(atan2(canvas_y/2-lip.y, lip.x-canvas_x/2));
      }
      else {
        translate(canvas_x-lip.x, canvas_y-lip.y);
        rotate(atan2(canvas_y/2-lip.y,canvas_x/2-lip.x));
      }
      ellipse(0,0,lerp(lip.h,lip.h/2,j/iterations),lerp(lip.w,lip.w/2,j/iterations));
      pop();
    }
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs