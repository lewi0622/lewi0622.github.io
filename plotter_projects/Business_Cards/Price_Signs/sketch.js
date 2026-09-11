'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 8

let font;

function gui_values(){
  parameterize("guide_lines", 0, 0, 1, 1, false);
  parameterize("text_size", 87, 1, 500, 1, true);
  parameterize("x_loc", 183, -base_x, base_x, 1, true);
  parameterize("y_loc", 150, -base_y, base_y, 1, true);
  parameterize("x2_loc", 0, -base_x, base_x, 1, true);
  parameterize("y2_loc", 98, -base_y, base_y, 1, true);
  parameterize("x3_loc", 0, -base_x, base_x, 1, true);
  parameterize("y3_loc", 98, -base_y, base_y, 1, true);
  parameterize("x4_loc", 0, -base_x, base_x, 1, true);
  parameterize("y4_loc", 98, -base_y, base_y, 1, true);
  parameterize("x5_loc", 0, -base_x, base_x, 1, true);
  parameterize("y5_loc", 98, -base_y, base_y, 1, true);
}

function setup() {
  common_setup(4*96, 6*96); //Maybe a lil small?
  gui_values();

  if(!redrawn){
    const buffer = fetch('..\\..\\..\\fonts\\Roboto-Black.ttf').then(res => res.arrayBuffer());
    buffer.then(data => {
      font = opentype.parse(data);
      draw();
    });
  }
}
//***************************************************
function draw() {
  if(!font) return -1; 
  global_draw_start();
  push();
  strokeWeight(LEPEN*global_scale);
  if(guide_lines){
    rect(0,0,canvas_x, canvas_y);
    line(canvas_x/2, 0, canvas_x/2, canvas_y);//middle line
    const num_lines = 6;
    for(let i=0; i<num_lines; i++){
      line(0, canvas_y * (i+1)/num_lines, canvas_x, canvas_y * (i+1)/num_lines);
    };
  }

  noFill();
  const line1 = font.getPath("$25", 0,0, text_size);
  const line2 = font.getPath("$50", 0,0, text_size);
  const line3 = font.getPath("$75", 0,0, text_size); 
  const line4 = font.getPath("$50",0,0, text_size);
  const line5 = font.getPath("$100",0,0, text_size);
  translate(x_loc, y_loc);
  draw_open_type_js_path_p5_commands(line1);
  translate(x2_loc, y2_loc);
  draw_open_type_js_path_p5_commands(line2);
  translate(x3_loc, y3_loc);
  draw_open_type_js_path_p5_commands(line3);
  translate(x4_loc, y4_loc);
  draw_open_type_js_path_p5_commands(line4);
  draw_open_type_js_path_p5_commands(font.getPath("Small", -150, -30, text_size/2));
  draw_open_type_js_path_p5_commands(font.getPath("Frame", -150, 10, text_size/2));
  translate(x5_loc, y5_loc);
  draw_open_type_js_path_p5_commands(line5);
  draw_open_type_js_path_p5_commands(font.getPath("Large", -150, -30, text_size/2));
  draw_open_type_js_path_p5_commands(font.getPath("Frame", -150, 10, text_size/2));
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs