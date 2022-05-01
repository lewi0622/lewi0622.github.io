type = 'svg';

gif = true;
noiseMax = 2;
phase_off = 20;
fr = 30;

capture = false;
capture_time = 8
num_frames = capture_time*fr;
capturer = new CCapture({format:'png', name:String(fr), framerate:fr});
function setup() {
  if(!capture){
    common_setup(gif, SVG);
    frameRate(fr);
  }
  else{
    common_setup(gif);
  }
  noFill();
  strokeWeight(1.5)
  angleMode(DEGREES)
  //cool stuff at 60
  i_mult = random([0, 1.5, 2.5,  5, 10, 20, 30, 40, 60])
  if(i_mult != 0){
    i_mult -= 0.1;
  }
}
//***************************************************
function draw() {
  capture_start(capture);
  clear();
  if(capture){
    background("WHITE");
  }
  //bleed
  bleed_border = apply_bleed();

  //actual drawing stuff
  push();
  translate(canvas_x/2, canvas_y/2);
  size = 300*global_scale;
  step_size = 3;
  beginShape();
  for(let i=0; i<720; i+=step_size){
    xoff = map(cos(i*i_mult), -1,1, 0, noiseMax);
    yoff = map(sin(i*i_mult), -1,1, 0, noiseMax);
    x = map(noise(xoff, yoff), 0,1, -size,size)
    
    xoff = map(cos((i+phase_off)*i_mult), -1,1, 0, noiseMax);  
    yoff = map(sin((i+phase_off)*i_mult), -1,1, 0, noiseMax);
    y = map(noise(xoff, yoff), 0,1, -size,size)
    curveVertex(x, y)
    
    i_mult += 0.000003

    }
  endShape();
  pop();
  //cleanup
  apply_cutlines();

  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs