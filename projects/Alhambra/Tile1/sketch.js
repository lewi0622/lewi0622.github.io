'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

suggested_palettes = [SAGEANDCITRUS, COTTONCANDY, SUPPERWARE]


function gui_values(){

}

function setup() {
  common_setup();
}
//***************************************************
function draw() {
  global_draw_start();

  //projct variables

  refresh_working_palette();
  working_palette = shuffle(working_palette, true);
  //apply background
  let bg_c = color("WHITE");
  background(bg_c);
  rectMode(CENTER);

  //actual drawing stuff
  push();
  noStroke();
  const tile_size = canvas_x;

  const sq_size = tile_size/10;
  const weight = tile_size/20;
  push();
  translate(canvas_x/2, canvas_y/2);
  fill(working_palette[1]);
  square(0,0, tile_size);

  //center Star
  fill(working_palette[0]);
  rect(0,0, sq_size*2.5, sq_size);
  rect(0,0, sq_size, sq_size*2.5)
  pop();

  rectMode(CORNER);
  for(let i=0; i<4; i++){
    push();
    center_rotate(i*90);
    //corner
    fill(working_palette[0]);
    square(0,0,sq_size*2);

    //mid
    fill(working_palette[2]);
    square(sq_size*2, 0, sq_size*2);
    square(0, sq_size*2, sq_size*2);

    //center
    fill(working_palette[3%working_palette.length]);
    square(sq_size*4, 0, sq_size*2);
    square(0, sq_size*4, sq_size*2);
    pop();
  }
  for(let i=0; i<1; i++){
    fill("TAN");
    stroke("BROWN");
    beginShape();
    vertex(tile_size/4, tile_size/8+weight/2);
    vertex(tile_size/2-weight, tile_size/8+weight/2);
    vertex(tile_size/2+sq_size/2, tile_size/2-sq_size/2);
    vertex(tile_size*7/8-weight/2, tile_size/2+weight);
    vertex(tile_size*7/8+weight/2, tile_size/2+weight);
    vertex(tile_size*7/8+weight/2, tile_size/2+weight/2);
    vertex(tile_size/2+sq_size/2+weight, 0);
    endShape();

    pop();
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs




