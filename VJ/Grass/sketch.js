'use strict';
//setup variables
const gif = true;
const animation = gif;
const fr = 30;
const capture = false;
const capture_time = 5;

const suggested_palettes = [];
function gui_values(){
  parameterize("row_grass", floor(base_y/12), 2, base_y, 1, false);
  parameterize("col_grass", floor(base_x/8), 2, base_x, 1, false);
  parameterize("grass_width", 10, 1, 20, 0.1, true);
}
/* 
improvements
- if density of grass changes, noise is wrong, change num_grass=10 to see this, should be based on location
- try different leaf shapes using control points
- create different patches of grass, color, density, and height
- add margins
- short grass behaves badly and really shows how it's being stretched instead of bent
*/
let c1, c2, weight;
let row_step, col_step;
let grass_coords;
function setup() {
  common_setup();
  gui_values();

  c1 = color("#713a00");
  c1.setAlpha(0);
  weight = 1 * global_scale;
  strokeWeight(weight);
  strokeJoin(ROUND);
  strokeCap(ROUND);

  document.body.style.background = "BLACK";
  pixelDensity(2);
}
//***************************************************
function draw() {
  global_draw_start();
  push();
  col_step = (canvas_x+grass_width*4)/col_grass;
  row_step = (canvas_y+grass_width*4)/row_grass;

  //generate static info, coordinates, height, and color
  grass_coords = [];
  for(let i=0; i<row_grass; i++){
    const row = [];
    for(let j=0; j<col_grass; j++){
      let starting_x = j * col_step;
      const starting_y = i * row_step;

      //semi random placement
      starting_x += map(noise((i + 1) * j/10), 0,1, -grass_width*2, grass_width*2);
      
      const grass_height = map(noise(i/10, j/10), 0,1, -200, 0) * global_scale;

      row.push([starting_x, starting_y, grass_height]);
    }
    grass_coords.push(row);
  }
  // background("WHITE")
  // background(c1);
  
  translate(-grass_width*2, 20);
  
  for(let i=0; i<row_grass; i++){
    for(let j=0; j<col_grass; j++){
      push();
      const coords = grass_coords[i][j];
      translate(coords[0], coords[1]);
      leaf_of_grass(grass_width, coords[2], i/100 + j/100, (i+1)/10);
      pop();
    }
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
function leaf_of_grass(w, h, wave_index, row_index){
  push();
  const [xoff, yoff]= noise_loop_2d(fr, capture_time, 1);
  const wave_amt = 10*w;
  const wave = map(noise(wave_index + xoff, row_index + yoff), 0,1, -wave_amt,wave_amt);

  erase(255,0);
  beginShape();
  vertex(0,0);
  bezierVertex(0,0, w/2 + wave, h, w/2 + wave, h);
  bezierVertex(w/2 + wave, h,w,0, w,0);

  endShape(CLOSE);
  noErase();

  noFill();
  stroke("WHITE");
  beginShape();
  vertex(0,0);
  bezierVertex(0,0, w/2 + wave, h, w/2 + wave, h);
  bezierVertex(w/2 + wave, h,w,0, w,0);

  endShape();

  pop();
  
}