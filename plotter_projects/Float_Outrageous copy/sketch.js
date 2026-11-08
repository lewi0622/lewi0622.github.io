'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

function gui_values(){
  parameterize("num_lines", floor(base_y * 3/4), 1, base_y*2, 1, false);
  parameterize("num_pts", floor(base_x * 3/4), 1, base_x*2, 1, false);
  parameterize("x_margin", 0, -base_x/2, base_x/2, 1, true);
  parameterize("y_margin", base_y/4, -base_y/2, base_y/2, 1, true);
  parameterize("amplitude", 200, 1, 400, 1, true);
  parameterize("close_shape", 1, 0, 1, 1, false);
  parameterize("on_count", 5, 1, 20, 1, false);
  parameterize("off_count", 1, 1, 20, 1, false);
  parameterize("min_pct_amp", 0.25, 0, 1, 0.01, false);
} 

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();
  push();
  strokeWeight(LEPEN * global_scale);
  const line_step = (canvas_y - y_margin)/num_lines;
  const pt_step = (canvas_x - x_margin)/num_pts;
  translate(x_margin/2, y_margin/2);
  let custom_iterator = 0;
  let current_color = working_palette[current_color_index(custom_iterator)];
  let last_y;
  let current_amplitude = amplitude;
  for(let i=0; i<num_lines; i++){
    push();
    if(current_color != "WHITE" && i%on_count == 0)current_color = "WHITE";
    else if(current_color == "WHITE" && i%off_count == 0) current_color = working_palette[current_color_index(custom_iterator)];
    stroke(current_color);
    translate(0, i * line_step);

    let y_symmetry_counter = 0;
    beginShape();
    for(let j=0; j<=num_pts; j++){
      let x = j * pt_step;
      let y = map(noise(custom_iterator/100, y_symmetry_counter/100), 0,1, -current_amplitude, current_amplitude);
      y = map(noise(1000 + y/100), 0, 1, -current_amplitude/2, current_amplitude/2);
      if(i/num_lines>=0.5) y *= -1;
      vertex(x,y);
      last_y = y;
      if(j/num_pts<0.5) y_symmetry_counter++;
      else y_symmetry_counter--;
    }
    
    if(close_shape){    
    vertex(width *2, last_y);
    vertex(width * 2, height*2);
    vertex(-width*2, height *2);
    
    
    endShape(CLOSE);
    } else {
      noFill();
      endShape();
    }

    pop();
    //x-axis symmetry
    if(i/num_lines<0.5){
      custom_iterator++;
      current_amplitude = lerp(amplitude, amplitude * min_pct_amp, i/num_lines * 2);
    }
    else{
      custom_iterator --;
      current_amplitude = lerp( amplitude * min_pct_amp, amplitude, map(i/num_lines, 0.5, 1, 0, 1));
    }
  }
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
function current_color_index(id, damp=10){
  return floor(working_palette.length * noise(id/damp));
}
