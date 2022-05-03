gif = true;
fr = 60;

xoff = 0;
xinc = 0.005*60/fr;
offset = 50;

function setup() {
  common_setup(gif);
  frameRate(fr);
  noFill();
  step = canvas_x/2/random(2,8);
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

  pts = 4;
  shape_rad = 150*global_scale;

  translate(canvas_x/2, canvas_y/2);

  y_size = canvas_y/4;
  beginShape();
  for(let i=-canvas_x/4; i<canvas_x/4; i+=step){
    if(i==-canvas_x/4){
      curveVertex(i, map(noise(xoff+i), 0,1, -y_size, y_size));
      curveVertex(i, map(noise(xoff+i), 0,1, -y_size, y_size));
    }
    else if(i+step>=canvas_x/4){
      curveVertex(canvas_x/4, map(noise(xoff+i), 0,1, -y_size, y_size));
      curveVertex(canvas_x/4, map(noise(xoff+i), 0,1, -y_size, y_size));
    }
    else{
      curveVertex(i+sin(xoff*10)*10*global_scale, map(noise(xoff+i), 0,1, -y_size, y_size));
    }
  }
  endShape();

  push();
  strokeWeight(7*global_scale)
  stroke("BLACK")
  rect(-canvas_x/4, -y_size, canvas_x/2, y_size*2)
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


