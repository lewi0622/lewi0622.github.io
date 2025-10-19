'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 50/fr;

const suggested_palettes = [];
function gui_values(){

}
/* 
improvements
- rows/cols based on canvas size
- global scale where applicable
- if density of grass changes, noise is wrong, change num_grass=10 to see this, should be based on location
- improve leaf of grass func to use width param
- fix naming of params and vars
- change circle obscuring base of leaf to rect for speed(?)
- change base of grass to be slightly randomized so grid cannot be seen
- pre-generate base of grass coords so we don't have to re-calc every time, toss in setup
- create different patches of grass, color, density, and height
*/
let c1, c2;
let grass_width = 10;
function setup() {
  common_setup();
  gui_values();
  c1 = color("#713a00");
  c2 = color("#dca352");
  fill(c1);
  stroke(c2);
}
//***************************************************
function draw() {
  global_draw_start();
  push();

  background("#713a00");
  
  translate(-grass_width, -grass_width);
  
  const row_grass = 15;
  const row_step = (height+grass_width*2)/row_grass;
  
  const num_grass = 50;
  const grass_step = (width+grass_width*2)/num_grass;
  for(let j=1; j<=row_grass; j++){
    push();
    translate(0, j * row_step);
    for(let i=0; i<num_grass; i++){
      push();
      translate(i * grass_step + noise(i*10)*5, 0);
      leaf_of_grass(i/100 + j/100 + frameCount/40, i, (j+1)/10);
      pop();
    }
    pop();
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
function leaf_of_grass(wave_index, height_index, row_index){
  push();
  const wave_amt = 10*grass_width;
  const h = map(noise(height_index, row_index), 0,1, -200, 0);
  const wave = map(noise(wave_index, row_index), 0,1, -wave_amt,wave_amt);
  translate(-grass_width/2,0);
  beginShape();
  vertex(0,0);
  bezierVertex(0,0, grass_width/2 + wave, h, grass_width/2 + wave, h);
  bezierVertex(grass_width/2 + wave, h,grass_width,0, grass_width,0);
  
  endShape(CLOSE);
  pop();
  
  push();
  stroke(c1);
  circle(0,0,grass_width);
  pop();
}