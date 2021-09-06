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
  petal_size = 40*global_scale;

  translate(canvas_x/2, canvas_y/2);
  // noStroke();

  distance = canvas_y/4;
  for(let i=0; i<5; i++){
    fill(random(palette));
    petalLayer(26-i*2, distance);

    distance -= canvas_y/20;
  }
  stroke(random(palette));
  strokeWeight(10*global_scale);

  pop();
  //cleanup
  apply_cutlines();
  save_drawing();
}
//***************************************************
//custom funcs
function petal(start_y){
  push();
  translate(0, start_y);
  beginShape();
  curveVertex(0,0);
  curveVertex(0,0);
  curveVertex(petal_size/2, petal_size/2);
  curveVertex(0, petal_size);
  curveVertex(-petal_size/2, petal_size/2);
  endShape(CLOSE);
  pop();
}

function petalLayer(num_petal, distance){
  for(let i=0; i<num_petal; i++){
    rotate(360/num_petal);
    petal(distance);
  }
}