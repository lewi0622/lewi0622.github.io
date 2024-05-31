'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 5;
const capture = false;
const capture_time = 2;

const suggested_palettes = [SOUTHWEST, BIRDSOFPARADISE, MUTEDEARTH];

function gui_values(){
  parameterize("iterations", 1000, 1, 2000, 1, false);
  parameterize("margin_x", -smaller_base/4, -base_x/2, base_x/2, 1, true);
  parameterize("margin_y", -smaller_base/4, -base_y/2, base_y/2, 1, true);
  parameterize("radius", random(5,60), 0, smaller_base/4, 1, true);
  parameterize("color_step_size", random(20, 200), 1, iterations*2, 1, false);
  parameterize("lerp_amt", 1, 0, 1, 0.1, false);
}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();
  push();
  
  const bg_c = color(png_bg(true));
  noStroke();

  working_palette = controlled_shuffle(working_palette, true);
  for(let i=0; i<working_palette.length; i++){
    working_palette[i] = color(working_palette[i]);
  }

  let current_step = 0;
  let color_index = 0;

  let start_x = canvas_x/2;
  let start_y = canvas_y;

  //generate a point that moves noisily inside the margins
  let theta = 0;
  for(let i=0; i<iterations; i++){
    if(current_step > color_step_size){
      color_index++;
      current_step = 0;
    }
    else current_step++;
    const c1 = working_palette[color_index%working_palette.length];
    const c2 = working_palette[(color_index+1)%working_palette.length];
    const c_fill = lerpColor(c1,c2, current_step/color_step_size);
    fill(c_fill);
    theta += random(1)
    const end_x = map(sin(theta) + noise(i/100), -1,2, margin_x, canvas_x-margin_x);
    const end_y = map(cos(theta) + noise(100 + i/100), -1,2, margin_y, canvas_y-margin_y);
    const x = lerp(start_x, end_x, random(lerp_amt));
    const y = lerp(start_y, end_y, random(lerp_amt));
    const rad = random(map(y, canvas_y, margin_y, radius, radius/4));
    line_blur(bg_c, 1*global_scale);
    drawingContext.shadowOffsetY = map(rad, 0, radius, 0, radius/16);
    drawingContext.shadowOffsetX = map(rad, 0, radius, 0, radius/16);
    circle(x,y,rad);
    line_blur(c_fill, 2*global_scale);
    drawingContext.shadowOffsetY = 0;
    drawingContext.shadowOffsetX = 0;
    circle(x,y,rad);
    // circle(x,y,rad);
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs