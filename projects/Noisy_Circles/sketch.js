gif = false;
fr = 1;

capture = false;
capture_time = 10;
function setup() {
  // suggested_palette = random([SAGEANDCITRUS, COTTONCANDY, SUPPERWARE]);
  common_setup(gif);
  // noStroke();
}
//***************************************************
function draw() {
  capture_start(capture);
  //bleed
  bleed_border = apply_bleed();

  working_palette = [...palette];

  //apply background
  bg_c = random(working_palette);
  bg_c[3] = 150;
  background(bg_c);
  reduce_array(working_palette, bg_c);

  //actual drawing stuff
  push();

  c=random(palette);
  reduce_array(palette,c)
  c[3]=30;
  stroke(c);
  // stroke(0,0,0,30);
  strokeWeight(global_scale);
  for(let i=0; i<60000; i++){
    point(random(canvas_x), random(canvas_y));
  }

  translate(canvas_x/2, canvas_y/2);

  c[3]=150
  strokeWeight(global_scale);
  stroke(c);
  c[3]=20;
  fill(c);

  sym_angs = round(random(6,32));
  rad = random(canvas_x/4, canvas_x/2);
  if(sym_angs%2==0){
    offset_me = true;
    offset = random(canvas_x/8);
  }
  else{
    offset_me = false;
  }
  x_offset = random(canvas_x/8, canvas_x/4);
  for(let i=0; i<sym_angs; i++){
    rotate(360/sym_angs);
    if(i%2==0 && offset_me){
      circle(x_offset+offset, 0, rad);
    }
    else{
      circle(x_offset, 0, rad);
    }
  }
  
  pop();
  //cutlines
  apply_cutlines();
  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs




