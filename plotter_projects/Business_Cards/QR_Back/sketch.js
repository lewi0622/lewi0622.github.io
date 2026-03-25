'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 8

let font, svg_width, svg_height, svg_viewbox, my_svg;

function gui_values(){
  parameterize("guide_lines", 0, 0, 1, 1, false);
  parameterize("text_size", 31, 1, 500, 1, true);
  parameterize("qr_x_loc", 16, -base_x, base_x, 1, true);
  parameterize("qr_y_loc", 28, -base_y, base_y, 1, true);
  parameterize("x_loc", 112, -base_x, base_x, 1, true);
  parameterize("y_loc", 55, -base_y, base_y, 1, true);
  parameterize("x2_loc", 170, -base_x, base_x, 1, true);
  parameterize("y2_loc", 0, -base_y, base_y, 1, true);
  parameterize("x3_loc", -150, -base_x, base_x, 1, true);
  parameterize("y3_loc", 50, -base_y, base_y, 1, true);
  parameterize("web_x_loc", -104, -base_x, base_x, 1, true);
  parameterize("web_y_loc", 65, -base_y, base_y, 1, true);
}

function preload(){
  my_svg = loadSVG('LinkTree_QR_Code.svg');
}

function setup() {
  common_setup(3.25*96, 2*96, SVG);
  gui_values();

  if(!redraw){
    // opentype.load('..\\..\\..\\fonts\\SquarePeg-Regular.ttf', function (err, f) {
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
  push();
  // background("TEAL")
  strokeWeight(LEPEN * global_scale);

  if(guide_lines){
    rect(0,0,canvas_x, canvas_y);
    line(canvas_x/2, 0, canvas_x/2, canvas_y);
    line(0, canvas_y/2, canvas_x, canvas_y/2);
    line(0, canvas_y/4, canvas_x, canvas_y/4);
    line(0, canvas_y*3/4, canvas_x, canvas_y*3/4);
  }
  image(my_svg, qr_x_loc, qr_y_loc, 80, 80);

  noFill();
  const line1 = font.getPath("Pen Plotter", 0,0, text_size);
  const line2 = font.getPath("&", 0,0, text_size);
  const line3 = font.getPath("Digital Art", 0,0, text_size);
  const website = font.getPath("LewistonFace.com", 0,0, text_size)
  translate(x_loc, y_loc);
  draw_open_type_js_path_p5_commands(line1);
  translate(x2_loc, y2_loc);
  draw_open_type_js_path_p5_commands(line2);
  translate(x3_loc, y3_loc);
  draw_open_type_js_path_p5_commands(line3);
  translate(web_x_loc, web_y_loc);
  draw_open_type_js_path_p5_commands(website);
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs