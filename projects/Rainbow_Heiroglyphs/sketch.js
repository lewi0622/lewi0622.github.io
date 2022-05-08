gif = true;
fr = 30;

xoff = 0;
xinc = 0.001*60/fr;
offset = 50;

capture = false;
capture_time = 340/fr;
function setup() {
  common_setup(gif);

  noFill();
  steps = floor(random(3,8));
  steps = 3;
  step_size = canvas_x/2/steps;
  colorMode(HSB);
  bg_c = "WHITE"
  background(bg_c)
}
//***************************************************
function draw() {
  capture_start(capture);
  //bleed
  bleed_border = apply_bleed();
  stroke(frameCount%360, 100, 100);

  //actual drawing stuff
  push();

  strokeWeight(5*global_scale);
  translate(canvas_x/4, canvas_y/2);

  y_size = canvas_y;
  for(let j=1; j<=2; j++){
    beginShape();
    for(let i=0; i<steps; i++){
      if(i==0){
        curveVertex(i*j*step_size, map(noise(xoff), 0,1, -y_size, y_size));
        curveVertex(i*j*step_size, map(noise(xoff), 0,1, -y_size, y_size));
      }
      else if(i+1>=steps){
        curveVertex(canvas_x/2, map(noise(xoff+i*j), 0,1, -y_size, y_size));
        curveVertex(canvas_x/2, map(noise(xoff+i*j), 0,1, -y_size, y_size));
      }
      else{
        curveVertex(i*j*step_size, map(noise(xoff+i*j*noise(i*j)), 0,1, -y_size, y_size));
      }
    }
    endShape();
  }

  push();
  fill("WHITE")
  noStroke();
  rect(-canvas_x/4, -canvas_y/4, canvas_x, -canvas_y/4)
  rect(-canvas_x/4, canvas_y/4, canvas_x, canvas_y/4)

  noFill();
  strokeWeight(7*global_scale)
  stroke("BLACK")
  rect(0, -canvas_y/4, canvas_x/2, canvas_y/2)
  pop();

  xoff+=xinc;
  pop();

  //cleanup
  apply_cutlines();

  if(frameCount ==num_frames){
    noLoop();
    capture_frame(capture, num_frames-1);
  }
  capture_frame(capture, num_frames-1);

}
//***************************************************
//custom funcs