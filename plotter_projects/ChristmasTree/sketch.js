'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

function gui_values(){
  parameterize("margin_y", base_y/16, 0, base_y/4, 1, true);
  parameterize("margin_x", base_x/16, 0, base_x/4, 1, true);
} 

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  noFill();
  strokeCap(ROUND);

  const c1 = color("PURPLE");
  const c2 = color("GREEN");
  const my_super_special_palette = [c1, c2];

  const radius = TRANSON_1 * global_scale;
  const row_step = radius * 2 * 0.8;
  const rows = floor((canvas_y - margin_y)/row_step);
  const max_cols = floor((canvas_x - margin_x)/(radius * 2));

  strokeWeight(radius);

  translate(canvas_x/2, margin_y/2);

  for(let i=0; i<rows; i ++){
    push();
    const cols = floor(lerp(1, max_cols, i/rows));
    translate(-cols * radius, i * row_step); 
    for(let j=0; j<cols; j++){
      push();
      translate(j * radius * 2, 0);
      stroke(random(my_super_special_palette));
      circle(0,0, radius);

      if(random()>0.5){
        stroke(random(["SILVER", "GOLD"]));
        strokeWeight(SIGNOBROAD*global_scale);
        circle(0,0,random(0.25,1)* radius * 2)
      }
      pop();
    }
    pop();
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs