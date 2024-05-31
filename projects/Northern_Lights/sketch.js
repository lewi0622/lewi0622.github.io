'use strict';

//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [COTTONCANDY, GAMEDAY, BIRDSOFPARADISE, SUMMERTIME, SOUTHWEST, SIXTIES, JAZZCUP];

function gui_values(){
  parameterize("cols", round(random(10,100)), 1, 100, 1, false);
  parameterize("rows", round(random(100,500)), 1, 1000, 1, false);
  parameterize("damp", random([1,2,5,10,25]), 1, 100, 1, false);
  parameterize("noise_offset", 0, -100, 100, 1, false);
  parameterize("width_mult", random([0.5,0.8,1,1,1,1]), 0, 1, 0.1, false);
}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();
  push();
  noStroke();
  working_palette = controlled_shuffle(working_palette, true);
  const c0 = color("BLACK");
  background(c0);
  const c1 = color(working_palette[0]);
  const c2 = color(working_palette[1]);
  const c3 = color(working_palette[2]);
  const col_width = ceil(canvas_x/cols);
  const row_height = canvas_y/rows;
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