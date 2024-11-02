'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 2;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

function gui_values(){
  parameterize("tile_size", random(10,50), 0, 100, 1, true);
  parameterize("num_steps", random(500,1000), 1, 2000, 1, false);
  parameterize("step_rotation", 0, -10, 10, 0.01, false);
  parameterize("amplitude", 50, 0, base_x, 1, true);
  parameterize("num_rows", 3, 1, 10, 1, false);
  parameterize("num_cols", 3, 1, 10, 1, false);
  parameterize("num_lines", 5, 1, 20, 1, false);
} 

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();
  push();
  concentric_background(POSCA*global_scale);

  const weight = PILOTPRECISEV5*global_scale;
  strokeWeight(weight);

  translate(0,-tile_size*max(num_cols, num_rows));

  //Start in upper left corner and move towards the lower right corner
  //get x,y noise values at point to generate anglez

  for(let j=0; j<num_lines; j++){
    push();
    translate(random(canvas_x), 0);
    beginShape();
    for(let i=0; i<num_steps; i++){
      push();
      const x = map(noise(i/100, j), 0,1, -amplitude, amplitude);
      const y = i * (canvas_y+tile_size*2*max(num_cols, num_rows))/num_steps;
      translate(x, y);
      translate(tile_size*1.5, tile_size*1.5);
      rotate(i * step_rotation);
      translate(-tile_size*1.5, -tile_size*1.5);
      vertex(x,y);
      // checkerboard(tile_size, num_rows, num_cols);
      pop();
    }
    endShape();
    pop();
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
function concentric_background(fill_weight, c="ORANGE"){
  push();
  stroke(c);
  strokeWeight(fill_weight);
  let bg_width = canvas_x;
  let bg_height = canvas_y;
  while(bg_height>0 && bg_width>0){
    rect(0,0, bg_width, bg_height);
    bg_width -= fill_weight;
    bg_height -= fill_weight;
    translate(fill_weight/2, fill_weight/2);
  }
  pop();
}


function checkerboard(size = 10, rows=3, cols=3, c1="WHITE", c2="BLACK"){
  push();
  translate(-size*cols/2, 0);
  let counter = 0;
  stroke(c1);
  // fill(c1);
  for(let i=0; i<cols; i++){
    for(let j=0; j<rows; j++){
      push();
      if(counter%2==1){
        stroke(c2);
        // fill(c2);
      }
      translate(i*size, j*size);
      square(0,0,size);

      counter++;
      pop();
    }
  }
  pop();
}