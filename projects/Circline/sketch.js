gif = false;
fr = 1;

capture = false;
capture_time = 10
num_frames = capture_time*fr;
capturer = new CCapture({format:'png', name:String(fr), framerate:fr});
function setup() {
  common_setup(gif);
  change_default_palette(random([8, 10, 12]));
  if(!capture){
    frameRate(fr);
  }
}
//***************************************************
function draw() {  
  capture_start(capture);

  //bleed
  bleed_border = apply_bleed();

  working_palette = [...palette];

  //apply background
  line_length = random([25, 40])*global_scale;
  circle_x = canvas_x/line_length;
  circle_y = canvas_y/line_length;
  console.log(canvas_x/line_length);
  random([bg_vertical_strips, bg_horizontal_strips])(random([2,3,4]));

  //actual drawing stuff
  push();
  translate(line_length/2, line_length/2);
  for(let i=0; i<circle_x; i++){
    for(let j=0; j<circle_y; j++){
      push();
      noStroke();
      fill(random(palette));
      translate(i*line_length, j*line_length);
      circle(0, 0, random(line_length*.3, line_length));
      pop();
    }
  }
  pop();
  
  //cutlines
  apply_cutlines();

  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs