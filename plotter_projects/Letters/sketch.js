let font;
function preload() {
  font = loadFont('..\\..\\fonts\\SquarePeg-Regular.ttf');
}

gif = false;
fr = 1;
capture = false;
capture_time = 10;
function setup() {
  common_setup(gif, SVG);
  letters = Array.from("EABCDEFGHIJKLMNOPQRSTUVWXYZ");
  letter_idx = 0;
}
//***************************************************
function draw() {
  clear();
  capture_start(capture);
  //bleed
  bleed_border = apply_bleed();
  // background("WHITE")

  //actual drawing stuff
  push();

  strokeWeight(1);

  noFill();
  stroke('BLACK')

  translate(150*global_scale, 250*global_scale);

  letter = letters[letter_idx%letters.length];
  points = font.textToPoints(letter, 0,0, 200*global_scale, {
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

  //cleanup
  apply_cutlines();

  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs


