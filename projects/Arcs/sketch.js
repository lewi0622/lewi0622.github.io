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
  linear_spread = floor(random([0, 2]))*global_scale;
  arcing(canvas_x*.75, linear_spread);
  pop();
  //cleanup
  apply_cutlines();
}
//***************************************************
//custom funcs
function arcing(limit, linear_spread){
  push();
  noFill();
  translate(canvas_x/2, canvas_y/2);
  for(let i=10*global_scale; i<limit; i+=1*global_scale){
    translate(random(0,linear_spread), random(0, linear_spread));
    
    radius = i * random(0.2, 3);
    stroke(random(palette));
    strokeWeight(random(1, 10)*global_scale);
    arc(0, 0, radius, radius, 0, random(45,300));
    rotate(random(0,360));
  }
  pop();
}


