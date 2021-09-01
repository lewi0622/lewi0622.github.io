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
  tile_x = canvas_x/100;
  tile_y = canvas_y/10;

  push();
  strokeWeight(5*global_scale);

  for(let j=0; j<5; j++){
    stroke(random(palette))

    translate(0, 65*global_scale);
    amp = 1*global_scale;

    beginShape();
    noFill();
    curveVertex(-10*global_scale,0);
    curveVertex(-10*global_scale,0);
    for(let i = 0;  i<canvas_x*2; i+=tile_x){
      l_r = random([-1,1,1])*tile_x*3;
      u_d = random([-1,1])*amp;
      curveVertex(i+noise(i+j)*l_r, noise(i+j)*u_d);
      amp +=0.5*global_scale;
    }

    endShape();

  }
  pop();
  //cutlines
  apply_cutlines();
    
  save_drawing();
}
//***************************************************
//custom funcs
function noise_curve(){
  beginShape();
  amp = 0.5*global_scale;
  for(let j=0; j<200; j++){
    vertex(j*2*global_scale, noise(j)*amp)
    if(j<100){
      amp += 0.15*global_scale;
    }
    else{
      amp -= 0.15*global_scale;
    }
  }
  endShape();
}


