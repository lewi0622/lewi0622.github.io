gif = false;
fr = 1;

capture = false;
capture_time = 10;
function setup() {
  common_setup(gif);
}
//***************************************************
function draw() {
  capture_start(capture);
  //bleed
  bleed_border = apply_bleed();

  //apply background

  //actual drawing stuff
  push();

  noStroke();

  brushSize = 100;
  brushC = random(palette);

  [startX,startY] = [0*global_scale,0*global_scale];
  [endX, endY] = [50*global_scale, 50*global_scale];

  var gradient = drawingContext.createLinearGradient(startX,startY, endX,endY);
  brushC[3]=30;
  gradient.addColorStop(0,color(brushC));
  brushC[3]=60;
  gradient.addColorStop(1, color(brushC));
  drawingContext.fillStyle = gradient;

  slope = (endY-startY)/(endX-startX);
  offset = endY-endX*slope;
  lnLength = Math.hypot((endX-startX), (endY-startY));

  translate(canvas_x/4, canvas_y/2);

  beginShape();
  vertex(startX,startY);
  vertex(startX,endY);
  vertex(endX,endY);
  vertex(endX,startY);
  endShape(CLOSE);BLACK
  
  pop();
  //cutlines
  apply_cutlines();

  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs




