'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
suggested_palettes = [SAGEANDCITRUS, COTTONCANDY, SUPPERWARE]
//geo json data obtained from https://eric.clst.org/tech/usgeojson/
let minnesota, bg_c;

function preload(){
  minnesota = loadJSON("minnesota.json");
}

function gui_values(){
  parameterize("weight", 1, 0, 20, 0.1, true, false);
  parameterize("state_count", random(1,10), 1, 10, 1, false, true);
}

function setup() {
  common_setup(gif);
  strokeWeight(weight);

  bg_c = random(working_palette);
  reduce_array(working_palette, bg_c);

  let state_color = random(working_palette);
  state_color = color(state_color);
  state_color.setAlpha(100);
  fill(state_color);
  stroke(random(working_palette));
}
//***************************************************
function draw() {
  capture_start(capture);
  //bleed
  const bleed_border = apply_bleed();

  push();


  background(bg_c);
  // let line_c = random(working_palette);
  // reduce_array(working_palette, line_c);
  // stroke(line_c);
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

  let offset = 5*global_scale; 
  for(let j=0; j<state_count; j++){
    let padding = j*20*global_scale;
    beginShape();
    for (let i = 0; i < coords.length; i++) {
      let lon = coords[i][0];
      let lat = coords[i][1];
      let x = map(lon, min_lon, max_lon, 0+padding, canvas_x-padding)-padding/2;
      let y = map(lat, min_lat, max_lat, canvas_y-padding, 0+padding);

      // x *= offset*()

      vertex(x,y);
    }
    endShape(CLOSE);
  }  
  pop();
  //cutlines
  apply_cutlines(bleed_border);
  capture_frame(capture);
}
//***************************************************
//custom funcs

