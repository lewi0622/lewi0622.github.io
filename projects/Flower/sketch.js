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
  petal_size = random(35,45)*global_scale;

  translate(canvas_x/2, canvas_y/2);
  if(random([0,1])==0){
    noStroke();
  }
  else{  
    stroke('black');
    strokeWeight(0.5*global_scale);}
  distance = canvas_y/random(3,5);
  for(let i=0; i<random(8,12); i++){
    rotate(random(0,360));
    petal_c = random(palette);
    fill(petal_c);
      // Shadow
    drawingContext.shadowColor = color(petal_c);
    drawingContext.shadowBlur = 10*global_scale;

    //at 30 or higher, the last half petal applies tends to overwrite lines
    petalLayer(floor(random(12,26)), distance);

    petal_size *= random(0.6, 0.9);
    distance *= random(0.7, 0.8);
  }

  pop();
  //cleanup
  apply_cutlines();
}
//***************************************************
//custom funcs
function petal(start_y, close){
  push();
  translate(0, start_y);
  beginShape();
  curveVertex(0,0);
  curveVertex(0,0);
  curveVertex(petal_size/2, petal_size/2);
  curveVertex(0, petal_size);
  curveVertex(-petal_size/2, petal_size/2);
  if(close){
    endShape(CLOSE);
  }
  else{
    endShape()
  }
  pop();
}

function petalLayer(num_petal, distance){
  for(let i=0; i<=num_petal; i++){
    rotate(360/num_petal);
    petal(distance, i!=num_petal);
  }
}