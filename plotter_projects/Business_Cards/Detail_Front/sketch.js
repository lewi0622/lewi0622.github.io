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
  parameterize("logo_text_size", 96, 1, 500, 1, true);
  parameterize("sub_text_size", 51, 1, 500, 1, true);
  parameterize("logo_x_loc", 16, -base_x, base_x, 1, true);
  parameterize("logo_y_loc", 76, -base_y, base_y, 1, true);
  parameterize("face_x_loc", 228, -base_x, base_x, 1, true);
  parameterize("face_y_loc", -49, -base_y, base_y, 1, true);
  parameterize("sub_x_loc", 13, -base_x, base_x, 1, true);
  parameterize("sub_y_loc", 152, -base_y, base_y, 1, true);
}

function setup() {
  common_setup(3.5*96, 2*96);
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
    line(canvas_x/2, 0, canvas_x/2, canvas_y);
    line(0, canvas_y/2, canvas_x, canvas_y/2);
  }

  noFill();

  const lewiston_path = font.getPath("Lewiston", 0,0, logo_text_size);
  const face_path = font.getPath(":D", 0,0, logo_text_size);
  const sub_path = font.getPath("Digital, Pen-Plotted Art", 0,0, sub_text_size);
  push();
  translate(logo_x_loc, logo_y_loc);
  draw_open_type_js_path_p5_commands(lewiston_path);
  translate(face_x_loc, face_y_loc);
  rotate(80);
  draw_open_type_js_path_p5_commands(face_path);
  pop();

  translate(sub_x_loc, sub_y_loc);
  draw_open_type_js_path_p5_commands(sub_path);

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs