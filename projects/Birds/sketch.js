function setup() {
  common_setup();
  
}
//***************************************************
function draw() {
  //bleed
  bleed_border = apply_bleed();

  //apply background
  bg(true);

  //actual drawing stuff
  push();
  eye_white = [255, 255, 255, 255];
  eye_black = [0, 0, 0, 255];

  noStroke();
  push();
  //head and eye
  translate(canvas_x/4, canvas_y/4);
  head();
  // beak
  translate(canvas_x/4, 0);
  beak();
  pop();

  push();
  //head and eye
  translate(canvas_x*3/4, canvas_y*3/4);
  head();
  // beak
  translate(-canvas_x/4, 0);
  beak(true);
  pop();

  pop();
  //cleanup
  apply_cutlines();
}
//***************************************************
//custom funcs
function head(){
  fill(random(palette));
  square(-canvas_x/4, -canvas_x/4, 200*global_scale);
  fill(eye_white);
  eye_size = random(75,125);
  circle(0,0, eye_size*global_scale);
  fill(random(palette))
  circle(0,0,eye_size*3/4*global_scale);
  fill(eye_black);
  circle(0,0,eye_size*1/2*global_scale);
}
function beak(reverse){
  if(reverse==true){
    rev = -1;
  }
  else{
    rev = 1;
  }
  fill(random(palette));
  triangle(0,0, 0,-canvas_y/4, canvas_x/2*rev,0);
  fill(random(palette));
  triangle(0,0, 0,canvas_y/4, canvas_x/2*rev,0);
}