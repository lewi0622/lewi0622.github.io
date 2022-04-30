type = 'svg';

gif = false;
function setup() {
  common_setup(gif, SVG);

}
//***************************************************
function draw() {
  clear();
  //bleed
  bleed_border = apply_bleed();

  //actual drawing stuff
  push();

  //fill hatch testing
  fill("BLACK");
  translate(canvas_x/2, canvas_y/2);
  circle(0,0,50);
  fill("GREEN")
  stroke("GREEN")
  circle(50,50, 100);


  pop();
  //cleanup
  apply_cutlines();
}
//***************************************************
//custom funcs


