'use strict';

//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 8;
let c;

function gui_values(){
  parameterize("start_rad", 5, 1, 100, 1, true);
  parameterize("rad_inc", 1, 1, 10, 1, true);
  parameterize("thic", 1, 1, 10, 1, false);
  parameterize("rot", 10, 0, 360, 1, false);
  parameterize("num_hexes", 10, 1, 200, 1, false);
}

function setup() {
  common_setup(1100, 850, SVG);
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  c=0;
  stroke(c);
  c++;

  rect(0,0, canvas_x, canvas_y);
  // line(canvas_x/2, 0, canvas_x/2, canvas_y);
  // line(0,canvas_y/2, canvas_x,canvas_y/2);

  for(let i=0; i<2; i++){
    for(let j=0; j<2; j++){
      rot = floor(random(-360,360));
      num_hexes =round(random(20, 40));
      image(create_hex_cnv(), i*canvas_x/2, j*canvas_y/2);
    }
  }

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs

function create_hex_cnv(){
  push();
  let card_w = canvas_x/2;
  let card_h = canvas_y/2;
  let hex_cnv = createGraphics(card_w, card_h, SVG);
  hex_cnv.stroke(c);
  c+=40;

  let hex_rad = start_rad + rad_inc*num_hexes;
  hex_cnv.translate(card_w/2, card_h/2);
  for(let j=0; j<num_hexes; j++){
    hex_cnv.rotate(j*rot);
    for(let z=0; z<thic; z++){
      hex_cnv.beginShape();
      for(let i=0; i<6; i++){
        const x = (hex_rad-z*global_scale/2)*cos(60*i);
        const y = (hex_rad-z*global_scale/2)*sin(60*i);
        hex_cnv.vertex(x,y);
      }
      hex_cnv.endShape(CLOSE);
    }
    hex_rad -= rad_inc;
  }
  pop();
  return hex_cnv;
}