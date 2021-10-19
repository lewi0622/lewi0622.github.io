function setup() {
  common_setup();
}
//***************************************************
function draw() {
  //bleed
  bleed_border = apply_bleed();

  //apply background
  bg_c = bg(true);

  //actual drawing stuff
  push();
  sqSize = 50*global_scale;

  translate(canvas_x/2, canvas_y/2);
  noisyRect(0,0,sqSize,0,sqSize,sqSize,0,sqSize);
  
  pop();
  //cutlines
  apply_cutlines();
  
  save_drawing();
}
//***************************************************
//custom funcs

function noisyRect(x1,y1, x2,y2, x3,y3, x4,y4){
beginShape();
  vertex(x1,y1);
  vertex(x2,y2);
  vertex(x3,y3);
  vertex(x4,y4);
endShape(CLOSE);
}