function setup() {
  common_setup();
}
//***************************************************
function draw() {
  //bleed
  bleed_border = apply_bleed();

  //apply background

  //actual drawing stuff
  push();

  noStroke();
  ctx = canvas.getContext('2d');

  brushSize = 100;
  brushC = random(palette);

  [startX,startY] = [0*global_scale,0*global_scale];
  [endX, endY] = [50*global_scale, 50*global_scale];

  var gradient = ctx.createLinearGradient(startX,startY, endX,endY);
  brushC[3]=30;
  gradient.addColorStop(0,color(brushC));
  brushC[3]=60;
  gradient.addColorStop(1, color(brushC));
  ctx.fillStyle = gradient;

  slope = (endY-startY)/(endX-startX);
  offset = endY-endX*slope;
  lnLength = Math.hypot((endX-startX), (endY-startY));

  translate(canvas_x/4, canvas_y/2);

  beginShape();
  vertex(startX,startY);
  vertex(startX,endY);
  vertex(endX,endY);
  vertex(endX,startY);
  endShape(CLOSE);

  // for(let x=startX; x<endX; x+=lnLength/brushSize){
  //   rect(x, x*slope+offset, lnLength/brushSize, brushSize*global_scale, global_scale, global_scale, global_scale, global_scale);
  // }
  
  pop();
  //cutlines
  apply_cutlines();
}
//***************************************************
//custom funcs




