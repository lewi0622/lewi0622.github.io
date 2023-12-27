'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 8

let font;

function gui_values(){
  parameterize("font_size", 50, 1, 400, 1, true);
}

function setup() {
  common_setup();

  if(!redraw){
    opentype.load('..\\..\\fonts\\PeachyRoseRegular-w1xpw.ttf', function (err, f) {
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
  noFill();
  let msg = "W"; // text to write
  let path = font.getPath(msg, 0,0, font_size);

  let bbox = path.getBoundingBox();
  translate((canvas_x - bbox.x2 - bbox.x1)/2, (canvas_y - bbox.y2 - bbox.y1)/2);

  draw_open_type_js_path_p5_commands(path);

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs