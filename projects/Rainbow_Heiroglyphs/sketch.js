function setup() {
  gif = true;
  fr = 60;
  
  xoff = 0;
  xinc = 0.005*60/fr;
  offset = 50;
  common_setup(gif);
  frameRate(fr);
  noFill();
  steps = floor(random(3,8));
  step_size = canvas_x/2/steps;
  colorMode(HSB);

  num_frames = 359*floor(random(1,6));
}
//***************************************************
function draw() {
  //bleed
  bleed_border = apply_bleed();
  stroke(frameCount%360, 100, 100);

  //actual drawing stuff
  push();

  strokeWeight(5*global_scale);
  translate(canvas_x/4, canvas_y/2);

  y_size = canvas_y/4;
  beginShape();
  for(let i=0; i<steps; i++){
    if(i==0){
      curveVertex(i*step_size, map(noise(xoff+i), 0,1, -y_size, y_size));
      curveVertex(i*step_size, map(noise(xoff+i), 0,1, -y_size, y_size));
    }
    else if(i+1>=steps){
      curveVertex(canvas_x/2, map(noise(xoff+i), 0,1, -y_size, y_size));
      curveVertex(canvas_x/2, map(noise(xoff+i), 0,1, -y_size, y_size));
    }
    else{
      curveVertex(i*step_size+sin(xoff*10)*10*global_scale, map(noise(xoff+i), 0,1, -y_size, y_size));
    }
  }
  endShape();

  push();
  strokeWeight(7*global_scale)
  stroke("BLACK")
  rect(0, -y_size, canvas_x/2, y_size*2)
  pop();

  xoff+=xinc;
  pop();

  //cleanup
  apply_cutlines();

  if(frameCount ==num_frames){
    noLoop();
  }

}
//***************************************************
//custom funcs


