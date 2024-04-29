'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];


function gui_values(){
  parameterize("cols", 10, 1, 100, 1, false);
  parameterize("tile_margin_div", 8, 1, 128, 2, false);
}

function setup() {
  common_setup();
  gui_values();
  rectMode(CENTER);
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  png_bg(true);
  stroke(random(working_palette));
  noFill();
  const tile_size = canvas_x/cols;
  const rows = round(canvas_y/tile_size);
  translate(tile_size/2, tile_size/2);
  for(let i=0; i<cols; i++){
    for(let j=0; j<rows; j++){
      push();
      translate(i*tile_size, j*tile_size);
      tile_squares(tile_size);
      pop();
    }
  }

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs

function tile_squares(tile_size){
  // square(0,0, tile_size);
  //Starting in the center of the tile
  //top line
  //pick a direction, left, right, or down
  const directions = shuffle(["left", "right", "down", "up"]);

  console.log(directions);
  beginShape();
  start_line(directions[0], tile_size);
  curveVertex(0, 0);
  end_line(end_line(directions[1]))
  endShape();
  beginShape();
  start_line(directions[2], tile_size);
  curveVertex(0, 0);
  end_line(end_line(directions[3]))
  endShape();
}

function start_line(dir, tile_size){
  const tile_margin = tile_size/tile_margin_div;
  if(dir == "left"){
    curveVertex(-tile_size/2, 0);
    curveVertex(-tile_size/2, 0);
    curveVertex(-tile_size/2 + tile_margin, 0);
  }
  else if(dir == "right"){
    curveVertex(tile_size/2, 0);
    curveVertex(tile_size/2, 0);
    curveVertex(tile_size/2 - tile_margin, 0);
  }
  else if(dir == "down"){
    curveVertex(0, tile_size/2);
    curveVertex(0, tile_size/2);
    curveVertex(0, tile_size/2 - tile_margin);
  }
  else if(dir == "up"){
    curveVertex(0, -tile_size/2);
    curveVertex(0, -tile_size/2);
    curveVertex(0, -tile_size/2 + tile_margin);
  }
}

function end_line(dir, tile_size){
  const tile_margin = tile_size/tile_margin_div;
  if(dir == "left"){
    curveVertex(-tile_size/2 + tile_margin, 0);
    curveVertex(-tile_size/2, 0);
    curveVertex(-tile_size/2, 0);
  }
  else if(dir == "right"){
    curveVertex(tile_size/2 - tile_margin, 0);
    curveVertex(tile_size/2, 0);
    curveVertex(tile_size/2, 0);
  }
  else if(dir == "down"){
    curveVertex(0, tile_size/2 - tile_margin);
    curveVertex(0, tile_size/2);
    curveVertex(0, tile_size/2);
  }
  else if(dir == "up"){
    curveVertex(0, -tile_size/2 + tile_margin);
    curveVertex(0, -tile_size/2);
    curveVertex(0, -tile_size/2);
  }
}