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
  strokeCap(ROUND);

  start = createVector(0,canvas_y,0);
  end = createVector(canvas_x,0,0);
  steps = 10;
  radius = 65*global_scale;
  strokeWeight(4*global_scale)

  center_rotate(random([0,90,180,270]));
  suns = random([2,4])

  for(let j=0;j<suns;j++){
    c = random(palette);
    stroke(c);
    fill(c);

    if(suns==4){
      center_rotate(90);
    }

    circle(0,0,radius);
    for(let i=1; i<steps; i++){
      v3 = p5.Vector.lerp(start, end, i/steps);
      line(0,0,v3.x,v3.y);
    }
    if(suns == 2){
    center_rotate(random([-90,0,90]));
    }

    translate(canvas_x, canvas_y);
    rotate(180);
  }
  pop();
  //cutlines
  apply_cutlines();
}
//***************************************************
//custom funcs


