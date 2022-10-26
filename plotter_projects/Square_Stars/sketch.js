'use strict';
//setup variables
const gif = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
let suggested_palette;


function gui_values(){

}

function setup() {
  suggested_palette = random([SAGEANDCITRUS, COTTONCANDY, SUPPERWARE]);
  common_setup(gif, SVG);
}
//***************************************************
function draw() {
  capture_start(capture);
  //bleed
  const bleed_border = apply_bleed();

  //projct variables

  refresh_working_palette();

  //apply background
  let bg_c = color("WHITE");
  background(bg_c)

  //actual drawing stuff
  push();
  noFill();
  // center_rotate(random([0,90]));
  translate(canvas_x/8, canvas_y/8);
  rectMode(CENTER);
  const sq_size = 20*global_scale;
  const star_size = 5*global_scale;
  const spacing = 10*global_scale;
  const y_offset = sqrt(2*pow(sq_size,2)) + star_size + spacing;
  const x_offset = (sqrt(2*pow(sq_size,2)) + star_size + spacing)/2;
  const x_steps = floor(canvas_x*7/8/x_offset);
  const y_steps = floor(canvas_y*7/8/y_offset);
  let c_id = 0;

  for(let i=0; i<x_steps; i++){
    push();
    if(i%2==0){
      translate(0,y_offset/2);
    }
    const c = working_palette[c_id%(working_palette.length)];
    stroke(c);
    for(let j=0; j<y_steps; j++){
      push();
      translate(i*x_offset, j*y_offset);
      if(i%2==0){
        push();
        translate(0, -y_offset/2)
        square(0,0, star_size);
        rotate(45);
        square(0,0, star_size);
        pop(); 
      }
      
      push();
      rotate(45);
      square(0,0,sq_size);
      pop();
      
      if(i%2==1){
        push();
        translate(0, y_offset/2)
        square(0,0, star_size);
        rotate(45);
        square(0,0, star_size);
        pop(); 
      }

      pop();
    }
    c_id++;
    pop();
  }
  pop();
  //cutlines
  apply_cutlines(bleed_border);
  capture_frame(capture);
}
//***************************************************
//custom funcs




