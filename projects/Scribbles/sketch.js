gif = false;
fr = 1;

capture = false;
capture_time = 10
num_frames = capture_time*fr;
capturer = new CCapture({format:'png', name:String(fr), framerate:fr});
function setup() {
  //default palette for this sketch only
  default_palette = random([6, 10, 13]);
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
  if(gif){
    //randomize noise seed
    noiseSeed(random(10000))
  }

  //apply background
  bg_c = random(working_palette)
  background(bg_c)
  reduce_array(working_palette, bg_c)

  //actual drawing stuff
  push();

  center_rotate(random([0,90,180,270]));

  tile_x = canvas_x/100;
  tile_y = canvas_y/10;

  strokeWeight(5*global_scale);

  for(let j=0; j<5; j++){
    stroke(random(working_palette))

    translate(0, 65*global_scale);
    amp = 1*global_scale;

    beginShape();
    noFill();
    curveVertex(-10*global_scale,0);
    curveVertex(-10*global_scale,0);
    for(let i = 0;  i<canvas_x*2; i+=tile_x){
      l_r = random([-1,1,1])*tile_x*3;
      u_d = random([-1,1])*amp;
      curveVertex(i+noise(i+j)*l_r, noise(i+j)*u_d);
      amp +=0.5*global_scale;
    }

    endShape();

  }
  pop();
  //cutlines
  apply_cutlines();

  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs
function noise_curve(){
  beginShape();
  amp = 0.5*global_scale;
  for(let j=0; j<200; j++){
    vertex(j*2*global_scale, noise(j)*amp)
    if(j<100){
      amp += 0.15*global_scale;
    }
    else{
      amp -= 0.15*global_scale;
    }
  }
  endShape();
}


