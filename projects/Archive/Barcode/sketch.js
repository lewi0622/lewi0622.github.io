gif = true;
fr = 30;

xoff = 0;
inc = 0.005*60/fr;
offset = 50;
theta = 90;
theta_inc = 0.5*60/fr;

capture = false;
capture_time = 8;
function setup() {
  common_setup(gif);

  //apply background
  bg_c = bg(true);
  palette_reset = JSON.parse(JSON.stringify(shuffle(palette)));
  theta_offset = random(180);
}
//***************************************************
function draw() {
  capture_start(capture);
  if(gif){
    clear();
    background(bg_c);
    palette = palette_reset;
  }
  //bleed
  bleed_border = apply_bleed();
  //actual drawing stuff
  push();
  noFill();
  strokeWeight(map(sin(theta), -1, 1, 1, 40)*global_scale);

  grad = drawingContext.createLinearGradient(0,canvas_y/2,canvas_x,canvas_y/2);
  grad.addColorStop(0,color(palette[0]));
  grad.addColorStop(1,color(palette[1]));
  drawingContext.strokeStyle = grad;

  translate(0, canvas_y/2);

  beginShape();
  for(i=-canvas_x/2; i<canvas_x; i++){
    curveVertex(i, (sin(i+theta_offset+theta)/map(noise(i+xoff),0,1,1,4) + map(noise(i+xoff), 0, 1, -1, 1))*global_scale*8000);
  }
  endShape();

  xoff += inc;
  theta += theta_inc;
  pop();

  //cutlines
  apply_cutlines();

  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs




