'use strict';
//setup variables
const gif = true;
const animation = gif;
const fr = 30;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];
function gui_values(){
  parameterize("row_grass", floor(base_y/26), 2, base_y, 1, false);
  parameterize("col_grass", floor(base_x/8), 2, base_x, 1, false);
  parameterize("grass_width", 10, 1, 20, 0.1, true);
}
/* 
improvements
- if density of grass changes, noise is wrong, change num_grass=10 to see this, should be based on location
- improve leaf of grass func to use width param
- create different patches of grass, color, density, and height
- add margins
*/
let c1, c2, weight;
let row_step, col_step;
let grass_coords;
function setup() {
  common_setup();
  gui_values();
  c1 = color("#713a00");
  c2 = color("#dca352");
  fill(c1);
  stroke(c2);
  weight = 1 * global_scale;
  strokeWeight(weight);

  col_step = (canvas_x+grass_width*4)/col_grass;
  row_step = (canvas_y+grass_width*4)/row_grass;

  grass_coords = [];
  for(let i=0; i<row_grass; i++){
    const row = [];
    for(let j=0; j<col_grass; j++){
      let starting_x = j * col_step;
      const starting_y = i * row_step;

      //semi random placement
      starting_x += map(noise((i + 1) * j/10), 0,1, -grass_width*2, grass_width*2);
      
      const grass_height = map(noise(j, (i+1)/10), 0,1, -200, 0) * global_scale;

      row.push([starting_x, starting_y, grass_height]);
    }
    grass_coords.push(row);
  }
}
//***************************************************
function draw() {
  global_draw_start();
  push();

  background(c1);
  
  translate(-grass_width*2, -grass_width*2);
  
  for(let i=0; i<row_grass; i++){
    for(let j=0; j<col_grass; j++){
      push();
      const coords = grass_coords[i][j];
      translate(coords[0], coords[1]);
      leaf_of_grass(i/100 + j/100 + frameCount/40, coords[2], (i+1)/10);
      pop();
    }
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
function leaf_of_grass(wave_index, h, row_index){
  push();
  const wave_amt = 10*grass_width;
  const wave = map(noise(wave_index, row_index), 0,1, -wave_amt,wave_amt);

  beginShape();
  vertex(0,0);
  bezierVertex(0,0, grass_width/2 + wave, h, grass_width/2 + wave, h);
  bezierVertex(grass_width/2 + wave, h,grass_width,0, grass_width,0);
  
  endShape(CLOSE);

  stroke(c1);
  strokeWeight(weight*2);
  line(0,0, grass_width, 0);
  pop();
  
}