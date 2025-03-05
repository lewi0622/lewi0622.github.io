'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

// let address_script = document.createElement('script');
// address_script.setAttribute('src', "addresses.js");
// document.head.appendChild(address_script);

let font;

function gui_values(){
  parameterize("font_size", 0.3*96, 1, 1000, 1, true);
  parameterize("x_move", 0, -base_x, base_x, 1, true);
  parameterize("y_move", 0, -base_y, base_y, 1, true);
}

function setup() {
  common_setup(6*96, 4*96, SVG);
  gui_values();

  if(!redraw){
    opentype.load('..\\..\\..\\fonts\\Roboto-Black.ttf', function (err, f) {
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
  // background(random(working_palette));
  push();
  const body_text = "Name Here";
  translate(x_move, y_move);
  const path = font.getPath(body_text, 0,0, font_size);
  draw_open_type_js_path_p5_commands(path);

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs

