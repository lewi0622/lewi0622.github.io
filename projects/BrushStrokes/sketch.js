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

  noiseDetail(random(4));

  strokeWeight(1*global_scale);
  steps = random(200,300);
  noFill();
  center_rotate(random(360));

  for(let z=0; z<2; z++){
    push();
    translate(0, random(canvas_y*.25, canvas_y*.5));
    dir = random([-1,1])
    noise_start = random(100);
    lines = random(150, 200);
    c = random(palette);
    reduce_array(palette, c);
    stroke(c);
    for(let j=0; j<lines; j++){
      push();
      translate(0, random(canvas_y*.35));
      beginShape();
      for(let i=0; i<steps + 10*global_scale; i++){
        push();
        vertex(canvas_x/steps*i, noise(noise_start + i/75)*global_scale*100*dir);
        pop();
      }
      endShape();
      pop();
    }
    pop();
    center_rotate(random([0,90,180,270]));

  }

  pop();
  erase();
  noFill();
  cutoutCircle(canvas_y/64);

  //cleanup
  apply_cutlines();
}
//***************************************************
//custom funcs


