'use strict';

//setup variables
const gif = true;
const animation = true;
const fr = 10;
const capture = false;
const capture_time = 5;

const suggested_palettes = [BIRDSOFPARADISE];

let z;
const z_inc = 0.01*30/fr;
let bg_c;
let c1,c2, tile_colors;
let grid_step_size, rows;
let offset_x, offset_y;
const cols = 100;

let font;
function preload() {
  font = loadFont('..\\..\\fonts\\Porcine-Heavy.ttf');
}

function gui_values(){
  parameterize("x_damp", random(10, random(10,400)), 1, 1000, 1, false);
  parameterize("y_damp", random([x_damp,random(10,400)]), 1, 1000, 1, false);
  parameterize("roughness", random(75), 1, 255, 1, false);
}

function setup() {
  common_setup();
  gui_values();
  refresh_working_palette();
  noStroke();
  colorMode(HSB);
  z = random(100);
  const colors = [];
  working_palette = controlled_shuffle(working_palette, true);
  for(let i=0; i<working_palette.length; i++){
    let c = working_palette[i];
    c = RGBA_to_HSBA(...c);
    c[2] = 255;
    colors.push(color(c));
  }

  grid_step_size = round(canvas_x/cols);
  rows = round(canvas_y/grid_step_size);
  
  const points = font.textToPoints("PIXEL", 0,0, 175*global_scale, { sampleFactor:  2 });
  let min_x = canvas_x;
  let max_x = -canvas_x;
  let min_y = canvas_y;
  let max_y = -canvas_y;
  for(let i=0; i<points.length; i++){
    const pt = points[i];
    if(min_x > pt.x) min_x = pt.x;
    if(max_x < pt.x) max_x = pt.x;
    if(min_y > pt.y) min_y = pt.y;
    if(max_y < pt.y) max_y = pt.y;
  }
  offset_x = (cols*grid_step_size)/2 - (max_x-min_x)/2;
  offset_y = (rows*grid_step_size)/2 + (max_y-min_y)/2;

  c1 = colors[0];
  c2 = colors[1];
  tile_colors = [];

  for(let i=0; i<cols; i++){
    const row = Array(rows).fill(c1);
    tile_colors.push(row);
  }

  for(let i=0; i<points.length; i++){
    const pt = points[i];

    const tile_i = floor((pt.x + offset_x)/grid_step_size);
    const tile_j = floor((pt.y + offset_y)/grid_step_size);

    if(tile_i<0 || tile_i>=cols || tile_j<0 || tile_j >= rows) continue;
    tile_colors[tile_i][tile_j] = c2;
  }
}
//***************************************************
function draw() {
  global_draw_start();
  push();
  for(let i=0; i<tile_colors.length; i++){
    const row = tile_colors[i];
    for(let j=0; j<row.length; j++){
      push();
      translate(i*grid_step_size, j*grid_step_size);
      const c = tile_colors[i][j];
      // let noise_val = map(noise(i/10, j/10, z), 0,1, 0, 255);
      let noise_val;
      let words = false;
      if(arrayEquals(c.levels, c1.levels)) noise_val = map(pnoise.simplex3(i/x_damp, j/y_damp, z), -1,1, 0, 255);
      else{
        noise_val = map(pnoise.simplex3(i/x_damp, j/y_damp, z), -1,1, 255, 0);
        words = true;
      }
      noise_val = round(noise_val/roughness)*roughness;

      c["levels"][1] = noise_val;
      if(words) {
        stroke(c);
        strokeWeight(10*global_scale);
      }
      fill(c);
      rect(0,0, grid_step_size);
      pop();
    }
  }
  z += z_inc;
  pop();
  global_draw_end();
}
//***************************************************