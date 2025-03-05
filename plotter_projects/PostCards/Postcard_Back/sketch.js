'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [SIXTIES]

let address_script = document.createElement('script');
address_script.setAttribute('src', "addresses.js");
document.head.appendChild(address_script);

let font;

function gui_values(){
  parameterize("margin", 0.25*96, 0, 200, 0.25, true);
  parameterize("font_size_body", 30, 1, 100, 1, true);
  parameterize("x_body", 85, -20, base_x/2, 0.5, true);
  parameterize("y_body", 330, 0, base_y, 0.5, true);
  parameterize("font_size_address", 28, 1, 100, 1, true);
  parameterize("x_address", 0, -20, 20, 0.5, true);
  parameterize("y_address", -5, -20, 20, 0.5, true);
}

function setup() {
  common_setup(5.8*96, 3.8*96, SVG);
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
  
  //apply postcard lines
  noFill();

  white_border();

  line(canvas_x/2, margin, canvas_x/2, canvas_y-margin);
  translate(canvas_x/2 + margin, canvas_y/2);

  let address_text = [];
  if(typeof addresses === "undefined"){
    address_text = [
          "Lewiston Face",
          "1234 My Street",
          "Apt 1",
          "Minneapolis, MN 55445",
          "USA"];
  }
  else address_text = addresses[0];
  for(let i=0; i<address_text.length; i++){
    push();
    translate(0, i*0.4*96);
    const path = font.getPath(address_text[i], 0,0, font_size_address);
    line(0,0, canvas_x/2-margin*2, 0);
    translate(x_address, y_address);
    draw_open_type_js_path_p5_commands(path);
    pop();
  }

  pop();
  push();//Space for message text 0-canvas_x/2, 0-canvas_y - margin

  const body_text = [
    "Design by @LewistonFace"
  ]
  translate(x_body, y_body);
  for(let i=0; i<body_text.length; i++){
    push();
    translate(0, i*0.4*96);
    const path = font.getPath(body_text[i], 0,0, font_size_body);
    // translate(x_address, y_address);
    draw_open_type_js_path_p5_commands(path);
    pop();
  }
  pop();

  global_draw_end();
}
//***************************************************
//custom funcs

