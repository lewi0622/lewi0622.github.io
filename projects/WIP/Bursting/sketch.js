'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 8;
const capture = false;
const capture_time = 2;

let grid_bg_c;
const suggested_palettes = [BIRDSOFPARADISE, NURSERY, SIXTIES, JAZZCUP];


function gui_values(){

}

function setup() {
  common_setup();
  gui_values();

  grid_bg_c = random(working_palette);
}
//***************************************************
function draw() {
  global_draw_start();

  translate(random(-10,10), random(-10, 10));
  
  // sunburst lighten
  translate(width/2, height/2);
  rotate(frameCount*2);
  const num_beams = 500;
  for(let i=0; i<num_beams; i++){
    const beam_len = random(width*3/4);
    push();
    strokeWeight(lerp(10,1,i/num_beams));
    strokeCap(SQUARE);
    blendMode(ADD);
    const c = color(random(palette));
    c.setAlpha(150);
    stroke(c);
    rotate(noise(i) * 720);
    line(0,0, beam_len, 0);
    pop();
  }
  //triangle darken
  // rotate(-90);
  const poly_pts = 5//floor(random(3,20));
  const theta_step = 360/poly_pts;
  const r = width/3;
  strokeWeight(20);
  // blendMode(SCREEN);
  const c = color("BLACK");
  c.setAlpha(200);
  stroke(c);
  noFill();
  beginShape();
  for(let i=0; i<poly_pts; i++){
    const theta = i * theta_step;
    const x = r * cos(theta);
    const y = r * sin(theta);
    vertex(x,y);
  }
  endShape(CLOSE);

  global_draw_end();
}
//***************************************************
//custom funcs
