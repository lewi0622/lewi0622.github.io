'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 30;
const capture = false;
const capture_time = 10;

const suggested_palettes = []

function gui_values(){  
  parameterize("num_vertices", 50, 1, 200, 1, false);
  parameterize("weight", 2, 1, 50, 0.1, true);
  parameterize("trans_x", 0, -base_x, base_x, 1, true);
  parameterize("trans_y", 0, -base_y, base_y, 1, true);
}

function setup() {
  common_setup();
  gui_values();
  pixelDensity(15);
}
//***************************************************
function draw() {
  global_draw_start();

  //apply background
  background("BLACK");

  //actual drawing stuff
  push();
  translate(trans_x, trans_y);
  strokeWeight(weight);
  blendMode(LIGHTEST);
  strokeCap(SQUARE);

  const colors = ["#0987f5", "#0bfc9b", "#f62a25"];
  translate(canvas_x/8, canvas_y/16);
  const offset_x = canvas_x/12;
  const offset_y = canvas_y/16;

  strokeJoin(BEVEL);
  for(let i=0; i<colors.length; i++){
    push();
    stroke(colors[i]);
    line_blur(colors[i], 3*global_scale, 0,0);
    noFill();
    translate(i * offset_x, i * offset_y);
  
    beginShape();
    for(let j=0; j<num_vertices; j++){
      let x = 0;
      if(j%2==0) x= canvas_x/3;
      const y = map(noise((i+1)/100,(j+1)/10), 0,1, 0, canvas_y) ;
      vertex(x,y);
    }
    endShape();
    pop();
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
