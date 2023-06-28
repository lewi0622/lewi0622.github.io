'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 4;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
suggested_palettes = [SAGEANDCITRUS, COTTONCANDY, SUPPERWARE]

let xoff = 0;
const inc = 0.1*60/fr;

let bg_c, front_c, side_c, top_c, c;


function gui_values(){

}

function setup() {
  common_setup();
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();
  //apply background
  if(frameCount == 1){
    bg_c = random(working_palette);
    if(working_palette.length>3){
      reduce_array(working_palette, bg_c);
    }
    front_c = random(working_palette);
    reduce_array(working_palette,front_c);
    side_c = random(working_palette);
    reduce_array(working_palette, side_c);
    top_c = random(working_palette);
    c = [front_c, side_c, top_c];
  }

  if(frameCount % 10 == 0){
    c.push(c.shift());
  }

  background(bg_c);
  //actual drawing stuff
  push();
  stroke("BLACK");
  const weight = 0.1*global_scale;
  strokeWeight(weight);

  //center
  push();
  translate(canvas_x/2, canvas_y/2);
  // noStroke();
  iso_block(canvas_y, c);
  pop();

  const block_size = 10*global_scale;
  const block_width = 2* block_size*cos(30);
  const block_height = 2*block_size;
  const grid_x = round(canvas_x*.9/block_width);
  const grid_y = round(canvas_y*.9/block_height*2);

  translate((canvas_x-grid_x*block_width)/2+block_width/2, (canvas_y-grid_y/2*block_height)/2);
  for(let j=0; j<grid_x; j++){
    for(let z=0; z<grid_y; z++){
      push();
      translate(j*block_width, z*block_height/2);
      if(z%2==1){
        translate(block_width/2, block_height/4);
      }
      if(0.6>noise(xoff + (j+1)*(z+1))){
        iso_block(block_size, c);
      }
      pop();
    }
  }
  xoff+=inc;
  pop();

  global_draw_end();
}
//***************************************************
//custom funcs

function iso_block(size, colors){
  for(let i=0; i<3; i++){
    push();
    rotate(i*120);
    fill(colors[i]);
    const x = size*cos(30);
    const y = size*sin(30);
    beginShape();
    //top left
    vertex(0,0);
    //bottom left
    vertex(0, size);
    //bottom right
    vertex(x, y);
    //top right
    vertex(x, y-size);
    endShape();
    pop();
  }
}


