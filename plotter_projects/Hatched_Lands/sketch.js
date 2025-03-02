'use strict';

//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

function gui_values(){
  parameterize("num_rects", 500, 1, 10000, 1, false);
  parameterize("min_size", 20, 0, smaller_base, 1, true);
  parameterize("max_size", 100, 0, smaller_base, 1, true);
  parameterize("min_lines", 3, 1, 50, 1, false);
  parameterize("max_lines", 10, 1, 100, 1, false);
  parameterize("rect_margin", 10, -base_x, base_x, 1, true);
}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();
  push();
  png_bg(true);
  strokeCap(PROJECT);
  const fill_c = random(working_palette);
  noStroke();
  strokeWeight(0.0944882*96*global_scale);
  fill("WHITE");
  const colors = [color("YELLOW"), color("CYAN"), color("MAGENTA")];

  for(let i=0; i<num_rects; i++){
    push();
    translate(random(canvas_x), random(canvas_y));
    rotate(random(360));
    const width = random(min_size, max_size);
    const height = random(min_size, max_size);
    rect(0,0, width, height);

    stroke("BLACK");
    const lines_per_rect = floor(random(min_lines, max_lines));
    const line_step_size = (width-rect_margin*2)/lines_per_rect;
    translate(rect_margin + line_step_size/2, rect_margin);
    for(let j=0; j<lines_per_rect; j++){
      push();
      const stroke_c = random(colors);
      stroke_c.setAlpha(150);
      stroke(random(colors));
      translate(j*line_step_size,0);
      line(0,0, 0,(height-rect_margin*2));
      pop();
    }
    pop();
  }
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs