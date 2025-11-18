'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 10;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

const z_inc = 0.01 * 30 /fr;
let z;


function gui_values(){
  parameterize("cols", random(50,150), 1, 100, 1, false);
  parameterize("angle_slices", random([1, 10, 15, 30, 45, 90]), 1, 360, 1, false);
  parameterize("radius_damp", random([10, 50, 100]), 1, 500, 1, false);
}

function setup() {
  common_setup();
  gui_values();
  noFill();
  z = 0;
  working_palette = controlled_shuffle(working_palette, true);
}
//***************************************************
function draw() {
  global_draw_start();
  push();
  const weight = LEPEN * global_scale;
  strokeWeight(weight);
  png_bg(false);

  const grid_size = canvas_x/cols;
  const square_iterations = floor(grid_size/weight);
  const rows = round(canvas_y/grid_size);
  translate(canvas_x/2 - grid_size/2, canvas_y/2 - grid_size/2);
  for(let i=-cols; i<cols; i++){
    for(let j=-rows; j<rows; j++){
      let x = i * grid_size;
      let y = j * grid_size;
      if(x == 0) x = 0.01;
      if(y == 0) y = 0.01;
      const r = sqrt(x*x + y*y);
      const theta = atan2(y,x) % angle_slices + z*100;

      const c_index = floor(working_palette.length * 2 * noise(random(1, 1.01) * r/radius_damp/global_scale, theta/100, z));
      const c = working_palette[c_index % working_palette.length];

      stroke(c);
      if(type == "png"){
        fill(c);
        square(x,y, grid_size);
      }
      else{
        for(let k=0; k<=square_iterations; k++){
          square(x + k * weight/2, y + k * weight/2, grid_size - k * weight);
        }
      }
    }
  }

  z += z_inc;
  pop();
  // line(0, canvas_y/2, canvas_x, canvas_y/2);
  // line(canvas_x/2, 0, canvas_x/2, canvas_y);
  global_draw_end();
}
//***************************************************
//custom funcs
