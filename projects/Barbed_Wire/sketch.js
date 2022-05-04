gif = false;
fr = 1;

capture = false;
capture_time = 10
num_frames = capture_time*fr;
capturer = new CCapture({format:'png', name:String(fr), framerate:fr});
function setup() {
  common_setup(gif);
  change_default_palette(random([0, 2, 10]));
  if(!capture){
    frameRate(fr);
  }
}
//***************************************************
function draw() {
  capture_start(capture);
  //bleed
  bleed_border = apply_bleed();

  xPos = 0;
  yPos = canvas_y/2;

  working_palette = [...palette];

  //apply background
  random([bg_vertical_strips, bg_horizontal_strips])(random([2,3,4]));

  //actual drawing stuff
  push();
  center_rotate(random([0, 180]));

  strokeCap(SQUARE);
  strokeWeight(30*global_scale)
  noFill();
  shape_type=TRIANGLES
  beginShape(shape_type);
  for(let i=0; i<1000*global_scale; i++){
    stroke(random(working_palette));
    //vertex
    vertex(xPos, yPos);

    //move
    xPos += random(-5,10)*global_scale;
    yPos += random(-4,4)*global_scale;

    //check for wrapping
    wrap(undefined, canvas_y/2);
  }
  //don't stroke last line to avoid one that ends in the middle of the page
  noStroke();
  endShape();
  
  pop();
  //cutlines
  apply_cutlines();

  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs