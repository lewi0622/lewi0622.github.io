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
  bg_c = bg(true);

  //actual drawing stuff
  push();
  // center_rotate(random([0,90,180,270]));
  const ctx = canvas.getContext('2d');

  step=10*global_scale;
  x_off = canvas_x/8;
  y_off = canvas_y/4;
  strokeWeight(2*global_scale);
  noFill();
  center_rotate(90);
  for(let i=0; i<canvas_x*0.75; i+=step){
    push();
    c = random(palette);
    stroke(c);
    vert_offset = i/(canvas_x*0.75) * canvas_y/4;
    translate(0, random(-vert_offset, vert_offset));

    // Shadow
    ctx.shadowColor = color(c);
    ctx.shadowBlur = 1*global_scale;
    for(let j= 0; j<canvas_y/2; j+=step){
      push();
      translate(i+x_off, j+y_off);
      rotate(random(-0.05,0.05)*i);
      square(random(-0.05, 0.05)*i, 0, step*(1-(i/canvas_x)));
      pop();
    }
    pop();
  }

  pop();
  //cleanup
  apply_cutlines(bleed_border);

  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs



