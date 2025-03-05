'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

let font;

function gui_values(){
  parameterize("font_size", 28, 1, 1000, 1, true);
  parameterize("x_move", 0, -base_x, base_x, 1, true);
  parameterize("y_move", 28, -base_y, base_y, 1, true);
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
  background(random(working_palette));
  push();
  noFill();
  const body_text = [
  "November Postcard time! This one is called",
  "Minimap, it reminds me of an old video game", 
  "or a simple D&D map.The distribution of the", 
  "shapes are based on a 2D Perlin noise map.",
  "I used Posca markers for this design, and",
  "I think this might be a fun one to make a",
  "huge 23x17 inch plot of!",
  "",
  "I really appreciate your continued support!",
  "",
  "Happy Fall!",
  "Eric Lewiston :D"
  ];
  translate(x_move, y_move);
  for(let i=0; i<body_text.length; i++){
    push();
    translate(0,i * font_size);
    const path = font.getPath(body_text[i], 0,0, font_size);
    draw_open_type_js_path_p5_commands(path);
    pop();
  }

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs

