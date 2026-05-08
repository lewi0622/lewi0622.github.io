'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 8

let logo_font, sub_text_font;

function gui_values(){
  parameterize("guide_lines", 0, 0, 1, 1, false);
  parameterize("logo_text_size", 260, 1, 500, 1, true);
  parameterize("face_text_size", 381, 1, 800, 1, true);
  parameterize("sub_text_size", 130, 1, 500, 1, true);
  parameterize("logo_x_loc", 12, -base_x, base_x, 1, true);
  parameterize("logo_y_loc", 291, -base_y, base_y, 1, true);
  parameterize("face_x_loc", 337, -base_x, base_x, 1, true);
  parameterize("face_y_loc", 268, -base_y, base_y, 1, true);
  parameterize("pp_x_loc", 140, -base_x, base_x, 1, true);
  parameterize("pp_y_loc", 500, -base_y, base_y, 1, true);
  parameterize("da_x_loc", 23, -base_x, base_x, 1, true);
  parameterize("da_y_loc", 407, -base_y, base_y, 1, true);
}

function setup() {
  common_setup(10*96, 10*96);
  gui_values();

  if(!redraw){
    opentype.load('..\\..\\..\\fonts\\SquarePeg-Regular.ttf', function (err, f) {
      if (err) {
        alert('Font could not be loaded: ' + err);
      } else {
        logo_font = f;
        draw();
      }
    })
    opentype.load('..\\..\\..\\fonts\\Roboto-Black.ttf', function (err, f) {
      if (err) {
        alert('Font could not be loaded: ' + err);
      } else {
        sub_text_font = f;
        draw();
      }
    })
  }
}
//***************************************************
function draw() {
  if(!logo_font || !sub_text_font) return;
  global_draw_start();
  push();
  noFill();
  stroke("BLACK")

  if(guide_lines){
    rect(0,0,canvas_x, canvas_y);
    // line(canvas_x/4, 0, canvas_x/4, canvas_y);
    line(canvas_x/2, 0, canvas_x/2, canvas_y);
    // line(canvas_x*3/4, 0, canvas_x*3/4, canvas_y);
    // line(0, canvas_y/4, canvas_x, canvas_y/4);
    line(0, canvas_y/2, canvas_x, canvas_y/2);
    // line(0, canvas_y*3/4, canvas_x, canvas_y*3/4);
  }

  const lewiston_path = logo_font.getPath("Lewiston Face", 0,0, logo_text_size);
  const face_path = logo_font.getPath(":D", 0,0, face_text_size);
  const sub_path = sub_text_font.getPath("Pen Plotter", 0,0, sub_text_size);
  const da_path = sub_text_font.getPath("Digital Art", 0,0, sub_text_size);
  push();
  translate(logo_x_loc, logo_y_loc);
  draw_open_type_js_path_p5_commands(lewiston_path);
  translate(face_x_loc, face_y_loc);
  rotate(80);
  draw_open_type_js_path_p5_commands(face_path);
  pop();

  translate(pp_x_loc, pp_y_loc);
  draw_open_type_js_path_p5_commands(sub_path);

  translate(da_x_loc, da_y_loc);
  draw_open_type_js_path_p5_commands(da_path);

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs