'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

let minnesota;

function preload(){
  minnesota = loadJSON("..\\..\\projects\\WIP\\Minnesota\\minnesota.json");
}

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
  strokeWeight(1*global_scale);
  const c1 = random(working_palette);
  reduce_array(working_palette, c1);
  const c2 = random(working_palette);
  noFill();
  const tile_size = canvas_x*1.25/cols;
  const rows = round(canvas_y*1.25/tile_size);
  for(let i=0; i<cols; i++){
    for(let j=0; j<rows; j++){
      push();
      stroke(c1);
      line_blur(color(c2), 2*global_scale);
      translate(i*tile_size, j*tile_size);
      tile_squares(tile_size);

      stroke(c2);
      line_blur(color(c1), 2*global_scale);
      translate(tile_size/2, tile_size/2);
      tile_squares(tile_size);
      pop();
    }
  }

  pop();
  draw_minnesota();

  global_draw_end();
}
//***************************************************
//custom funcs

function tile_squares(tile_size){//Starting in the center of the tile
  const directions = shuffle(["left", "right", "down", "up"]);

  beginShape();
  start_line(directions[0], tile_size);
  curveVertex(random(-tile_size/2 + tile_margin_div, tile_size/2 - tile_margin_div), random(-tile_size/2 + tile_margin_div, tile_size/2 - tile_margin_div));
  end_line(directions[1], tile_size);
  endShape();
  beginShape();
  start_line(directions[2], tile_size);
  curveVertex(random(-tile_size/2 + tile_margin_div, tile_size/2 - tile_margin_div), random(-tile_size/2 + tile_margin_div, tile_size/2 - tile_margin_div));
  end_line(directions[3], tile_size);
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

function draw_minnesota(){
  push();
  stroke("GREEN");
  noFill();
  let coords = minnesota.geometry.coordinates[0];

  let min_lon, max_lon, min_lat, max_lat;
  min_lon = 181;
  max_lon = -181;
  min_lat = 91;
  max_lat = -91;

  for(let i=0; i<coords.length; i++){
    if(coords[i][0]<min_lon) min_lon = coords[i][0];
    if(coords[i][0]>max_lon) max_lon = coords[i][0];
    if(coords[i][1]<min_lat) min_lat = coords[i][1];
    if(coords[i][1]>max_lat) max_lat = coords[i][1];
  }

  let padding = 20*global_scale;
  beginShape();
  for (let i = 0; i < coords.length; i++) {
    let lon = coords[i][0];
    let lat = coords[i][1];
    let x = map(lon, min_lon, max_lon, 0+padding, canvas_x-padding)-padding/2;
    let y = map(lat, min_lat, max_lat, canvas_y-padding, 0+padding);

    vertex(x,y);
  }
  endShape(CLOSE);
  pop();
}