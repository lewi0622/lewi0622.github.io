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
  translate(canvas_x/2, canvas_y/2);
  for(let i=0; i<25; i++){
    // start = createVector(random(-canvas_x/8, canvas_x/8), random(-canvas_y/8, canvas_y/8), 0);
    start = createVector(noise(i)*random([-canvas_x/8, canvas_x/8]), noise(i+1)*random([-canvas_y/8, canvas_y/8]), 0);
    steps = random(50,100);
    scale_factor = 2*global_scale
    slope = start.y/start.x;
    radius = 15*global_scale;
    prev_x = start.x;
    prev_y = start.y;

    noStroke();
    //get two unique colors
    col1 = color(random(palette));
    col2 = color(random(palette));
    while(col2==col1){
      col2=random(palette);
    }

    for(let j=0; j<steps; j++){
      fill(lerpColor(col1, col2, j/steps));
      new_x = start.x + Math.sign(start.x)*j*scale_factor
      new_y = new_x*slope;
      radius += random(-2, 2)*global_scale
      ellipse(new_x, new_y, random(radius*.75, radius*1.5), random(radius*.75, radius*1.5));
      rotate(random(-4,4));
      prev_x = new_x;
      prev_y = new_y;
    }
  }
 

  pop();
  //cleanup
  apply_cutlines();
  save_drawing();
}
//***************************************************
//custom funcs
