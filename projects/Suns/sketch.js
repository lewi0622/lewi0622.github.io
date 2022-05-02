gif = false;
fr = 1;

capture = false;
capture_time = 10
num_frames = capture_time*fr;
capturer = new CCapture({format:'png', name:String(fr), framerate:fr});
function setup() {
  //default palette for this sketch only
  default_palette = random([1, 9, 14]);
  common_setup(gif);
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
  bg_c = random(working_palette)
  background(bg_c)
  reduce_array(working_palette, bg_c)

  //actual drawing stuff
  push();
  strokeCap(ROUND);

  start = createVector(0,canvas_y,0);
  end = createVector(canvas_x,0,0);
  steps = 10;
  radius = 65*global_scale;
  strokeWeight(4*global_scale)

  center_rotate(random([0,90,180,270]));
  suns = random([2,4])

  for(let j=0;j<suns;j++){
    c = random(working_palette);
    stroke(c);
    fill(c);

    if(suns==4){
      center_rotate(90);
    }

    circle(0,0,radius);
    for(let i=1; i<steps; i++){
      v3 = p5.Vector.lerp(start, end, i/steps);
      line(0,0,v3.x,v3.y);
    }
    if(suns == 2){
    center_rotate(random([-90,0,90]));
    }

    translate(canvas_x, canvas_y);
    rotate(180);
  }
  pop();
  //cutlines
  apply_cutlines();

  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs


