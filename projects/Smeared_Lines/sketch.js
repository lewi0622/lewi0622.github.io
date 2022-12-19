'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 5;
const capture = false;
const capture_time = 2;
const sixteen_by_nine = false;
let grid_bg_c;
suggested_palettes = [SIXTIES, SOUTHWEST, TOYBLOCKS];


function gui_values(){
  parameterize("line_spacing", random(1,300), 1, 300, 1, true);
  parameterize("min_line_len", 5, 1, 100, 1, true);
  parameterize("max_line_len", 20, 1, 200, 1, true);
  parameterize("drop_chance", 0.8, 0.01, 1, 0.01, false);
  parameterize("weight", random(0.1,20), 0.1, 100, 0.1, true);
  parameterize("vertical_step_num", 200, 1, 1000, 1, false);
  parameterize("max_brightness", 400, 0, 700, 10, false);
  parameterize("max_shadow_blur_size", random(2,10), 0, 200, 1, true);
}

function setup() {
  common_setup(gif);
}
//***************************************************
function draw() {
  capture_start(capture);
  //bleed
  const bleed_border = apply_bleed();

  refresh_working_palette();
  //actual drawing stuff
  push(); 
  strokeCap(ROUND);
  const bg_c = bg();
  reduce_array(working_palette, bg_c);
  noFill();
  const num_lines = canvas_x/line_spacing;
  let x_positions = [];
  for(let i=0; i<num_lines; i++) x_positions.push(i*line_spacing);
  x_positions = shuffle(x_positions);
  for(let i=0; i<num_lines; i++){
    let line_color = random(working_palette);
    stroke(line_color);
    strokeWeight(weight);
    let x = x_positions[i];
    let y=0;
    let prev_x, prev_y;
    while(y<canvas_y){
      prev_x = x;
      prev_y = y;
      const line_len = random(min_line_len, max_line_len);
      if(random(y/canvas_y)>(y/canvas_y)*drop_chance){
        y=canvas_y;
      }
      else{
        x += random([-1,1])*line_len;
        y += line_len;
      }
      line(prev_x, prev_y, x, y);
    }
    push();
    for(let j=0; j<=vertical_step_num; j++){
      const pct_y_distance = j/vertical_step_num;
      const new_y = lerp(prev_y,y,pct_y_distance);
      const brightness = constrain(floor(max_brightness*pct_y_distance), 100, 1000);
      drawingContext.shadowColor=color(line_color);
      drawingContext.shadowBlur = max_shadow_blur_size*pct_y_distance;
      drawingContext.filter = 'brightness('+brightness+'%)';
      line(prev_x, new_y, prev_x,y);
    }
    pop();
  }

  pop();

  //cutlines
  apply_cutlines(bleed_border);
  capture_frame(capture);
}
//***************************************************
//custom funcs
