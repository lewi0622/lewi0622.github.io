'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 5;
const capture = false;
const capture_time = 2;
const sixteen_by_nine = false;
suggested_palettes = [SAGEANDCITRUS, BIRDSOFPARADISE, SUMMERTIME, JAZZCUP];

function gui_values(){
  parameterize("grid_size", 1, 1, 400, 0.5, true);
  parameterize("grid_pad_num", 0, 0, 50, 1, false);
  parameterize("layers", 500, 1, 1000, 1, false);
  parameterize("steps", 1000, 1, 5000, 1, false);
  parameterize("cor", 0, 0, 100, 1, true);
}

function setup() {
  common_setup();
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();
  //actual drawing stuff
  push();
  background("#f2eadb")
  noStroke();

  speckles(200, 1);

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs
function speckles(alpha, size_mult){
  grid_size = round(grid_size);
  let cols = floor(canvas_x/grid_size);
  let rows = floor(canvas_y/grid_size);
  for(let z=0; z<layers; z++){
    push();
    const c = color(random(working_palette));
    c.setAlpha(alpha);
    fill(c);

    const start_col = ceil(random(grid_pad_num, cols-grid_pad_num));
    const start_row = ceil(random(grid_pad_num, rows-grid_pad_num));
    let x = start_col*grid_size;
    let y = start_row*grid_size;
    for(let i=0; i<steps; i++){
      square(x,y,grid_size*size_mult, cor,cor,cor,cor);
      let new_x=-1;
      let new_y=-1;
      while(new_x<grid_pad_num*grid_size || new_x>canvas_x-grid_pad_num*grid_size || new_y<grid_pad_num*grid_size || new_y>canvas_y-grid_pad_num*grid_size){
        new_x = x + random([-1,0,1])*grid_size;
        new_y = y + random([-1,0,1])*grid_size;
      }
      x = new_x;
      y = new_y;
    }
    pop();
  }
}