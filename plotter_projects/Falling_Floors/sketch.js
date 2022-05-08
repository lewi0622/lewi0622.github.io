gif = true;
noiseMax = 2;
phase = 0;
phase_off = 20;
phase_inc = 0.01;
fr = 30;

capture = false;
capture_time = 8;
function setup() {
  common_setup(gif, SVG);

  noFill();
  strokeWeight(1.5)
  angleMode(DEGREES)
  // i_mult = random([12, 20, 30])
  i_mult = 100
}
//***************************************************
function draw() {
  clear();
  //bleed
  bleed_border = apply_bleed();

  //actual drawing stuff
  push();

  //create grid of tiles
  //add squares to random tiles
  //for each square, check if next to other square add lines

  pop();
  //cleanup
  apply_cutlines();
}
//***************************************************
//custom funcs


