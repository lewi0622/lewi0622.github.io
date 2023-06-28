'use strict';
let font;
function preload() {
  font = loadFont('..\\..\\fonts\\SquarePeg-Regular.ttf');
}
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

//project variables
let letter_idx = 0;
const letters = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");


function gui_values(){

}

function setup() {
  common_setup(6*96, 6*69, SVG);
}
//***************************************************
function draw() {
  global_draw_start();
  // background("WHITE")

  //actual drawing stuff
  push();

  strokeWeight(1);

  noFill();
  stroke('BLACK')

  translate(150*global_scale, 250*global_scale);

  const letter = letters[letter_idx%letters.length];
  const points = font.textToPoints(letter, 0,0, 200*global_scale, {
    sampleFactor: 0.1,
    simplifyThreshold: 0
  });

  points.forEach(p => {
    push();
    translate(p.x, p.y);
    // line(0,0, 10*global_scale, 10*global_scale);
    circle(0,0, 200*global_scale);
    // square (0,0, 100*global_scale);
    pop();
  });

  letter_idx++;

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs


