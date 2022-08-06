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
  const bleed_border = apply_bleed();

  //apply background
  bg_c = bg(true);

  //actual drawing stuff
  push();
  rad = 300*global_scale;
  last_rad = rad;
  noStroke();
  num_circles=palette.length;

  translate(canvas_x/2, canvas_y/2);
  for(let i=0; i<palette.length;){
    c = random(palette);
    fill(c);
    reduce_array(palette, c);

    wobble = random(rad-last_rad, last_rad-rad)*.25;

    push();
    rotate(random(0,360));
    translate(wobble, 0);
    circle(0,0, rad);
    pop();

    last_rad = rad;
    rad*=(1-1/num_circles);
  }
  pop();

  push();
  const ctx = canvas.getContext('2d');
  ctx.shadowColor = bg_c;
  ctx.shadowBlur = 15;

  step=10*global_scale;
  bg_c[3]=100;
  noStroke();
  fill(bg_c);
  for(let i=0; i*step<canvas_x; i++){
    for(let j= 0; j*step<canvas_y; j++){
      offset = j%2*(step/2);
      push();
      translate(i*step+offset, j*step);
      rotate(45);
      square(0, 0, 3*global_scale);
      pop();
    }
  }

  pop();
  //cleanup
  apply_cutlines(bleed_border);

  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs



