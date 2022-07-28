gif = false;
fr = 1;

capture = false;
capture_time = 10;
function setup() {
  suggested_palette = random([COTTONCANDY, SOUTHWEST, OASIS]);
  common_setup(gif);
}
//***************************************************
function draw() {
  capture_start(capture);

  //bleed
  bleed_border = apply_bleed();

  working_palette = JSON.parse(JSON.stringify(palette));
  if(gif){
    //randomize noise seed
    noiseSeed(random(10000))
  }

  //apply background
  bg_horizontal_strips(2);

  //actual drawing stuff
  push();
  noFill();
  base_size = 20;
  size = working_palette.length*base_size*global_scale;
  translate(0, canvas_y/2)
  for(let i=0; i<working_palette.length; i){
    push();
    strokeWeight(size);
    col = random(working_palette);
    stroke(col);

    noise_curve();

    reduce_array(working_palette, col);
    size -= base_size*global_scale;
    pop();
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
  vertex(-canvas_x/2, 0);

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

  vertex(canvas_x*1.5,0);
  endShape();
}


