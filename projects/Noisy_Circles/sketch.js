gif = false;
fr = 1;

capture = false;
capture_time = 10;
function setup() {
  suggested_palette = random([SAGEANDCITRUS, SUMMERTIME, SOUTHWEST]);
  common_setup(gif);
}
//***************************************************
function draw() {
  capture_start(capture);
  //bleed
  bleed_border = apply_bleed();

  working_palette = JSON.parse(JSON.stringify(palette));

  //apply background
  background("WHITE")
  bg_c = random(working_palette);
  reduce_array(working_palette, bg_c);
  bg_c[3] = 150;
  background(bg_c);


  //actual drawing stuff
  push();

  c=random(working_palette);
  reduce_array(working_palette,c)
  stroke(c);
  noFill();
  strokeWeight(global_scale*0.01);
  for(let i=0; i<60000; i++){
    circle(random(-canvas_x/2, canvas_x*1.5), random(-canvas_y/2, canvas_y*1.5), canvas_x/2);
  }

  c=random(working_palette);
  translate(canvas_x/2, canvas_y/2);

  c[3]=150
  strokeWeight(global_scale);
  stroke(c);
  c[3]=50;
  fill(c);


  drawingContext.filter = 'brightness(110%)';
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
  apply_cutlines(bleed_border);
  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs




