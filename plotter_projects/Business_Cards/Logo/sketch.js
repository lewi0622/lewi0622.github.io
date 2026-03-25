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
  parameterize("text_size", 96, 1, 500, 1, true);
  parameterize("x_loc", 7, -base_x, base_x, 1, true);
  parameterize("y_loc", 77, -base_y, base_y, 1, true);
  parameterize("face_x_loc", 228, -base_x, base_x, 1, true);
  parameterize("face_y_loc", -49, -base_y, base_y, 1, true);
  parameterize("face_text_x_loc", -137, -base_x, base_x, 1, true);
  parameterize("face_text_y_loc", 145, -base_y, base_y, 1, true);
}

//Standard Business Cards are 3.5"x2"
//I shortened it to 3.25" to match the size of a credit card

function setup() {
  common_setup(3.25*96, 2*96); 
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

  strokeWeight(SHARPIE * global_scale);

  if(guide_lines){
    rect(0,0,canvas_x, canvas_y);
    line(canvas_x/2, 0, canvas_x/2, canvas_y);
    line(0, canvas_y/2, canvas_x, canvas_y/2);
  }

  noFill();
  translate(x_loc, y_loc);

  const lewiston_path = font.getPath("Lewiston", 0,0, text_size);
  const face_path = font.getPath(":D", 0,0, text_size);
  const face_text_path = font.getPath("Face", 0,0,text_size);
  draw_open_type_js_path_p5_commands(lewiston_path);
  translate(face_x_loc, face_y_loc);
  push();
  rotate(80);
  draw_open_type_js_path_p5_commands(face_path);

  pop();

  translate(face_text_x_loc, face_text_y_loc);
  draw_open_type_js_path_p5_commands(face_text_path);
  // textSize(text_size);
  // translate(0*global_scale, canvas_y/2)
  // text("Lewiston", 0,0);
  // translate(text_size*2.4, -text_size/2);
  // rotate(80);
  // text(":D", 0, 0)

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs