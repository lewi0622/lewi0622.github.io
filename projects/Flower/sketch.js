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
  const ctx = canvas.getContext('2d');

  push();
  petal_size = random(35,45)*global_scale;

  translate(canvas_x/2, canvas_y/2);
  if(random([0,1])==0){
    noStroke();
  };
  distance = canvas_y/random(3,5);
  for(let i=0; i<random(8,12); i++){
    rotate(random(0,360));
    petal_c = random(palette);
    fill(petal_c);
      // Shadow
    ctx.shadowColor = color(petal_c);
    ctx.shadowBlur = 10;

    petalLayer(26, distance);

    petal_size *= random(0.6, 0.9);
    distance *= random(0.7, 0.8);
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