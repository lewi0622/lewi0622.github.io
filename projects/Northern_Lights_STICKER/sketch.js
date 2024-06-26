'use strict';

//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [COTTONCANDY, GAMEDAY, BIRDSOFPARADISE, SUMMERTIME, SOUTHWEST, SIXTIES, JAZZCUP];

let minnesota;
function preload(){
  minnesota = loadJSON("..\\..\\projects\\WIP\\Minnesota\\minnesota.json");
}

function gui_values(){
  parameterize("cols", round(random(10,100)), 1, 100, 1, false);
  parameterize("rows", round(random(100,500)), 1, 1000, 1, false);
  parameterize("damp", random([1,2,5,10,25]), 1, 100, 1, false);
  parameterize("noise_offset", 0, -100, 100, 1, false);
  parameterize("width_mult", random([0.5,0.8,1,1,1,1]), 0, 1, 0.1, false);
  parameterize("x_offset", 0, -base_x, base_x, 1, true);
  parameterize("y_offset", 0, -base_y, base_y, 1, true);
}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();
  push();

  fill("BLACK");
  stroke("WHITE");
  strokeWeight(10*global_scale);
  // circle(canvas_x/2, canvas_y/2, canvas_x);
  translate(x_offset, y_offset);
  noFill();
  strokeJoin(ROUND);
  strokeWeight(5*global_scale);
  const mn_padding = 50*global_scale;
  draw_minnesota(mn_padding);
  pop();
  push();
  drawingContext.clip();
  noStroke();
  working_palette = controlled_shuffle(working_palette, true);
  const c0 = color("BLACK");
  background(c0);
  const c1 = color(working_palette[0]);
  const c2 = color(working_palette[1]);
  const c3 = color(working_palette[2]);
  const col_width = ceil((canvas_x-mn_padding*2)/cols);
  const row_height = (canvas_y-mn_padding*2)/rows;
  translate(mn_padding, mn_padding);
  for(let i=0; i<cols; i++){
    push();
    translate(i * col_width, 0);
    const c1_loc = map(noise(noise_offset + i/damp), 0,1, 0, 0.33);
    const c2_loc = map(noise(noise_offset + i/damp), 0,1, 0.33, 0.66);
    const c3_loc = map(noise(noise_offset + i/damp), 0,1, 0.66, 0.99);
    for(let j=0; j<rows; j++){
      const pct = j/rows;
      push();
      translate(0, j*row_height);
      let c_start = c0;
      let c_end = c1;
      let c_pct = map(pct, 0, c1_loc, 0, 1);
      if(c1_loc<=pct && pct<c2_loc){
        c_start = c1;
        c_end = c2;
        c_pct = map(pct, c1_loc, c2_loc, 0, 1);
      }
      else if(c2_loc<=pct && pct<c3_loc){
        c_start = c2;
        c_end = c3;
        c_pct = map(pct, c2_loc, c3_loc, 0, 1);
      }
      else if(c3_loc<=pct){
        c_start = c3;
        c_end = c0;
        c_pct = map(pct, c3_loc, 1, 0, 1);
      }
      const c = lerpColor(c_start, c_end, c_pct);
      fill(c);
      rect(0,0,col_width*width_mult, row_height*2);
      pop();
    }
    pop();
  }
  pop();
  global_draw_end();
}
//***************************************************
function draw_minnesota(padding){
  //there are 3416 coordinates
  push();
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

  //get min/max values to center drawing
  let min_x = canvas_x;
  let max_x = 0;
  let min_y = canvas_y;
  let max_y = 0;
  for (let i = 0; i < coords.length; i++) {
    let lon = coords[i][0];
    let lat = coords[i][1];
    let x = map(lon, min_lon, max_lon, 0+padding, canvas_x-padding);
    let y = map(lat, min_lat, max_lat, canvas_y-padding, 0+padding);
    if(x<min_x) min_x = x;
    if(x>max_x) max_x = x;
    if(y<min_y) min_y = y;
    if(y>max_y) max_y = y;
  }
  
  translate((canvas_x-max_x-min_x)/2,(canvas_y-max_y-min_y)/2);

  console.log(coords.length);
  beginShape();
  for (let i = 0; i < coords.length; i++) {
    let lon = coords[i][0];
    let lat = coords[i][1];
    let x = map(lon, min_lon, max_lon, 0+padding, canvas_x-padding);
    let y = map(lat, min_lat, max_lat, canvas_y-padding, 0+padding);
    if(i%5==0) continue; //skipping every 5th point
    vertex(x,y);
  }
  endShape(CLOSE);
  pop();
}