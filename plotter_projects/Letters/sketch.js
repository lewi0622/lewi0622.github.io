'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 3;
const capture = false;
const capture_time = 10;

let font;
function preload() {
  font = loadFont('..\\..\\fonts\\SquarePeg-Regular.ttf');
}

//project variables
let letter_idx = 0;
const letters = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
let bg_c, stroke_c;

function gui_values(){
  parameterize("font_size", smaller_base, 0, smaller_base*2, 1, true);
  parameterize("circle_size", smaller_base/8, 0, smaller_base, 1, true);
  parameterize("sample_factor", 0.05, 0.001, 1, 0.001, false);
}

function setup() {
  common_setup();
  if(bg_c == undefined) gui_values();
  bg_c = png_bg(true);
  stroke_c = random(working_palette);
  noFill();
  stroke(stroke_c);
  line_blur(color(stroke_c), 2*global_scale);
  strokeWeight(1*global_scale);

}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  background(bg_c);

  const letter = letters[letter_idx%letters.length];
  const points = font.textToPoints(letter, 0,0, font_size, {
    sampleFactor: sample_factor,
    simplifyThreshold: 0
  });

  let min_x = canvas_x;
  let max_x = 0;
  let min_y = canvas_y;
  let max_y = 0;
  points.forEach(p => {
    if(p.x<min_x) min_x=p.x;
    if(p.x>max_x) max_x=p.x;
    if(p.y<min_y) min_y=p.y;
    if(p.y>max_y) max_y=p.y;
  });

  //center design
  const offset_x = (canvas_x - max_x-min_x)/2;
  const offset_y = (canvas_y - max_y-min_y)/2;
  translate(offset_x, offset_y);

  points.forEach(p => {
    push();
    translate(p.x, p.y);
    // line(0,0, 10*global_scale, 10*global_scale);
    circle(0,0, circle_size);
    // square (0,0, 100*global_scale);
    pop();
  });

  letter_idx++;

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs


