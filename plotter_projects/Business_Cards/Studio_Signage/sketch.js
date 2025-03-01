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
  parameterize("text_size", 93, 1, 500, 1, true);
  parameterize("x_loc", 126, -base_x, base_x, 1, true);
  parameterize("y_loc", 93, -base_y, base_y, 1, true);
  parameterize("x2_loc", -42, -base_x, base_x, 1, true);
  parameterize("y2_loc", 70, -base_y, base_y, 1, true);
  parameterize("x3_loc", 23, -base_x, base_x, 1, true);
  parameterize("y3_loc", 84, -base_y, base_y, 1, true);
  parameterize("x4_loc", -93, -base_x, base_x, 1, true);
  parameterize("y4_loc", 88, -base_y, base_y, 1, true);
}

function setup() {
  common_setup(4*96, 4*96);
  gui_values();

  if(!redraw){
    opentype.load('..\\..\\..\\fonts\\SquarePeg-Regular.ttf', function (err, f) {
      if (err) {
        alert('Font could not be loaded: ' + err);
      } else {
        font = f;
        draw();
      }
    })
  }
}
//***************************************************
function draw() {
  if(!font) return;
  global_draw_start();
  push();
  if(guide_lines){
    rect(0,0,canvas_x, canvas_y);
    line(canvas_x/2, 0, canvas_x/2, canvas_y);//middle line
    line(0, canvas_y*(1/5), canvas_x, canvas_y*(1/5));
    line(0, canvas_y*(2/5), canvas_x, canvas_y*(2/5));
    line(0, canvas_y*(3/5), canvas_x, canvas_y*(3/5));
    line(0, canvas_y*(4/5), canvas_x, canvas_y*(4/5));
  }

  noFill();
  const line1 = font.getPath("Robot", 0,0, text_size);
  const line2 = font.getPath("Drawing", 0,0, text_size);
  const line3 = font.getPath("Demos", 0,0, text_size);
  const line4 = font.getPath("Studio #406", 0,0, text_size);
  translate(x_loc, y_loc);
  draw_open_type_js_path_p5_commands(line1);
  translate(x2_loc, y2_loc);
  draw_open_type_js_path_p5_commands(line2);
  translate(x3_loc, y3_loc);
  draw_open_type_js_path_p5_commands(line3);
  translate(x4_loc, y4_loc);
  draw_open_type_js_path_p5_commands(line4);
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs