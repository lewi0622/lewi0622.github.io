gif = true;
fr = 30;

xoff = 0;
inc = 0.005*60/fr;
offset = 50

capture = false;
capture_time = 3
function setup() {
  common_setup(gif);
  change_default_palette(random([SUMMERTIME, SOUTHWEST, JAZZCUP]));

  bg_c = random(palette)
}
//***************************************************
function draw() {
  capture_start(capture);

  //bleed
  bleed_border = apply_bleed();

  working_palette = [...palette];

  //apply background
  background(bg_c)
  reduce_array(working_palette, bg_c)
  //actual drawing stuff
  push();

  noFill();
  strokeWeight(3*global_scale);
  translate(canvas_x/2, canvas_y/2);
  //shadow
  drawingContext.shadowBlur = noise(xoff)*global_scale*10;

  for(let i=0; i<map(noise(xoff), 0, 1, 10, 110); i++){
    c = color(working_palette[i%Math.min(3, working_palette.length)])
    drawingContext.shadowColor = c;
    stroke(c)
    circle(0,0, map(noise(xoff+offset*i), 0, 1, -100, 600)*global_scale);
  }  

  xoff += inc;
  pop();
  noFill();
  
  // erase();
  stroke('#eeede9')
  cutoutCircle(canvas_y/128);
  noErase();
  //cutlines
  apply_cutlines();

  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs




