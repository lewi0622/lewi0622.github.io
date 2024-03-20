'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 5;
const capture = false;
const capture_time = 2;

let grid_bg_c;
const suggested_palettes = [BIRDSOFPARADISE, SUMMERTIME, OASIS];
let x,y,prev_x, prev_y, vertical_step_num;

function gui_values(){
  parameterize("line_spacing", random(1,100), 1, 300, 1, true);
  parameterize("min_line_len", random(1,50), 1, 100, 1, true);
  parameterize("max_line_len", random(1,100), 1, 200, 1, true);
  parameterize("drop_chance", random(0.8, 1), 0.01, 1, 0.01, false);
  parameterize("weight", random(0.1,10), 0.1, 100, 0.1, true);
  // parameterize("vertical_step_num", 200, 1, 1000, 1, false);
  parameterize("max_brightness", random(250, 500), 0, 700, 10, false);
  parameterize("max_shadow_blur_size", random(2,30), 0, 200, 1, true);
  parameterize("drip_len", random(1,150), 1, 400, 1, true);
}

function setup() {
  common_setup();
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();
  //actual drawing stuff
  push(); 
  strokeCap(ROUND);
  drawingContext.shadowBlur=random(10)*global_scale;
  const bg_c = random(working_palette);
  background(bg_c);
  if(line_spacing/global_scale>10) reduce_array(working_palette, bg_c);
  vertical_step_num = map(drip_len/global_scale, 1, 150, 15, 200);
  noFill();
  const num_lines = canvas_x/line_spacing;
  let x_positions = [];
  for(let i=0; i<num_lines; i++) x_positions.push(i*line_spacing);
  x_positions = shuffle(x_positions);
  for(let i=0; i<num_lines; i++){
    let line_color = random(working_palette);
    stroke(line_color);
    strokeJoin(random([MITER, BEVEL, ROUND]));
    strokeWeight(weight);
    x = x_positions[i];
    y=0;
    prev_x = x;
    prev_y = y;
    push();
    drawingContext.shadowColor=color(0,0,0,100);

    squiggle(true);
    let drip_y = prev_y;
    let drip_x = x;
    y = prev_y + drip_len;
    squiggle(false);
    pop();
    x=drip_x;
    prev_y=drip_y;
    y=drip_y+drip_len;
    drawingContext.shadowColor=color(line_color);
    drip();
  }

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs
function squiggle(drop){
  let curved = random()>0.5;
  beginShape();
  vertex(x,y);
  while(y<canvas_y+max_line_len){
    if(curved)curveVertex(x,y);
    else vertex(x,y);
    prev_x = x;
    prev_y = y;
    const line_len = random(min_line_len, max_line_len);
    if(drop && random(y/canvas_y)>(y/canvas_y)*drop_chance){
      y=canvas_y*2;
    }
    else{
      x += random([-1,1])*line_len;
      y += line_len;
    }
  }
  vertex(prev_x, prev_y);
  endShape();
}
function drip(){
  let drip_dist = (y-prev_y)/vertical_step_num;
  for(let j=0; j<=vertical_step_num; j++){
    //blur
    const pct_y_distance = j/vertical_step_num;
    const new_y = lerp(prev_y,y,pct_y_distance);
    if(pct_y_distance<0.5){
      strokeWeight(map(pct_y_distance, 0, 0.5, weight, weight*2));
      drawingContext.shadowBlur = max_shadow_blur_size*pct_y_distance;
    }
    else{
      strokeWeight(map(pct_y_distance, 0.5, 1, weight*2, weight));
      drawingContext.shadowBlur = max_shadow_blur_size*(1-pct_y_distance);
    }
    if(j==vertical_step_num) line(x, new_y, x, y);
    else line(x, new_y, x, new_y+drip_dist);
  }
  drawingContext.shadowBlur = 0;
  push();
  for(let j=0; j<=vertical_step_num/2; j++){
    //bright
    const pct_y_distance = j/vertical_step_num;
    const new_y_top = lerp(prev_y, y, pct_y_distance);
    const new_y_bottom = lerp(y, prev_y, pct_y_distance);
    let brightness;
    if(pct_y_distance<0.5){
      strokeWeight(map(pct_y_distance, 0, 0.5, weight, weight*2));
      brightness = constrain(floor(max_brightness*pct_y_distance), 100, 1000);
    }
    drawingContext.filter = 'brightness('+brightness+'%)';
    line(x, new_y_top, x, new_y_top+drip_dist);
    line(x, new_y_bottom, x, new_y_bottom-drip_dist);
  }
  pop();
}