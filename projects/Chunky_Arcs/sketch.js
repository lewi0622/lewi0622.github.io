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

  arcing(canvas_x);
  
  //cutlines
  apply_cutlines();
  
  save_drawing();
}
//***************************************************
//custom funcs
function arcing(width){
  push();
  noFill();

  translate(canvas_x/2, canvas_y/2);
  let old_SW = 5*global_scale;
  let old_radius = canvas_x/20;
  let radius = 0;
  let angles = random(70, 100);

  rotate(random(0,360));
  while(radius < canvas_x-50*global_scale){
    radius = old_radius+old_SW*2+random(5,6)*global_scale;
    sw = radius - old_radius - old_SW -5*global_scale;

    stroke(random(palette));
    strokeWeight(sw);

    arc(0, 0, radius, radius, 0, angles);
    arc(0, 0, radius, radius, 180, 180+angles);
    rotate(20);

    old_SW = sw;
    old_radius = radius;
  }
  pop();
}


