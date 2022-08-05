gif = false;
fr = 1;

capture = false;
capture_time = 8
function setup() {
  common_setup(gif, SVG);
  colors = gen_n_colors(2);
}
//***************************************************
function draw() {
  capture_start(capture);
  //bleed
  bleed_border = apply_bleed();

  //actual drawing stuff
  push();

  strokeWeight(1*global_scale);

  noFill();

  translate(canvas_x/2, canvas_y/2);
  num_circles = 25;
  stroke(colors[0]);
  for(let i=0; i<num_circles; i++){
    rotate(20);
    push();
    if(i%4==0){
      fill(colors[1]);
    }
    circle(0,i*global_scale*5, 5*global_scale*i + 5*global_scale);
    pop();
  } 
  
  pop();

  //cleanup
  apply_cutlines(bleed_border);

  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs


