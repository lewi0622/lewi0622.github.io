type = 'svg';

function preload() {  font = loadFont('..\\..\\fonts\\SquarePeg-Regular.ttf');  }

function setup() {
  common_setup(false, SVG, 100, 80);

  textFont(font);
  textSize(32*global_scale);
}
//***************************************************
function draw() {
  //bleed
  bleed_border = apply_bleed();
  push();
  translate(0*global_scale, canvas_y/2)
  text("Lewiston", 0,0);
  rotate(80);
  text(":D", 0, -78*global_scale)

  pop();
  //cleanup
  apply_cutlines();
}
//***************************************************
//custom funcs