'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 10;

let k;
const k_inc = 1;
let locations;
let bg_c, rows, grid_size;

const suggested_palettes = [];

function gui_values(){
  parameterize("cols", 200, 1, 1000, 1, false);
} 

function setup() {
  common_setup();
  gui_values();
  // center_rotate(random([0,180]));
  k=1;
  working_palette = controlled_shuffle(working_palette, true);
  bg_c = random(working_palette);
  grid_size = canvas_x*2 / cols;
  rows = round(canvas_y*2 / grid_size);

  locations = [];
  for(let i=0; i<cols; i++){
    const col_loc = []
    for(let j=0; j<rows; j++){
      const c_index = floor(working_palette.length * 2 * noise(i/20, j/20));
      col_loc.push([i * grid_size, j* grid_size, c_index % working_palette.length]);
    }
    locations.push(col_loc);
  }
  loop();
}
//***************************************************
function draw() {
  global_draw_start(false);

  //actual drawing stuff
  push();
  translate(-canvas_x/2, -canvas_y/2);
  // if(type == "png") background(bg_c);
  noFill();
  let continue_count = 0;
  for(let i=0; i<cols; i++){
    for(let j=0; j<rows; j++){
      const x_start = locations[i][j][0];
      const y_start = locations[i][j][1];

      const theta = map(noise(i/100, j/100, k/100), 0,1, 0, 400);
      const radius = grid_size*2;

      const x = x_start + radius * cos(theta);
      const y = y_start + radius * sin(theta);
      const snapped_xy = snap_to_grid(x,y,grid_size);
      locations[i][j][0] = snapped_xy[0];
      locations[i][j][1] = snapped_xy[1];

      if(snapped_xy[0]<-canvas_x/2 || snapped_xy[0]>canvas_x*1.5 || snapped_xy[1]<-canvas_y/2 || snapped_xy[1]>canvas_y*1.5){
        continue_count++;
        continue;
      }

      const c = working_palette[locations[i][j][2]];
      stroke(c);
      fill(c);

      square(snapped_xy[0], snapped_xy[1], grid_size);
    }
  }

  //consider changing dual for loops to be one that loops through locs
  //option to skip animation, keep track of what color each grid is, don't draw anything until end
  //fix artifacting
  //jump discontinutiy based on size
  //initial colors based on size
  //save svg as small lines instead of squares, use vpype to connect them using nearest points

  k += k_inc;
  if(frameCount%30==0) k += 100; //jump discontinuity in k
  if(continue_count/(cols*rows)>0.9){
    noLoop();
  }
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs

function snap_to_grid(x,y){
  return [floor(x/grid_size) * grid_size, floor(y/grid_size) * grid_size];
}