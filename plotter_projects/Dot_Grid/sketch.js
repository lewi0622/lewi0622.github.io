'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [COTTONCANDY, SIXTIES, SUPPERWARE]


function gui_values(){
  parameterize("dot_size", 0.5*96, 0.1, 10, 0.1, true);
}

function setup() {
  common_setup(6*96, 8*96, SVG);
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  
  const x_steps = canvas_x/dot_size;
  const y_steps = canvas_y/dot_size;

  // strokeWeight(dot_size);
  for(let i=0; i<=x_steps; i++){
    for(let j=0; j<=y_steps; j++){
      push();

      let x_offset = 0;
      if (j%2 == 0) x_offset = dot_size/2;

      let y_offset = 0;
      if(i%2 ==0) y_offset = dot_size/2;
      translate(i*dot_size + x_offset, j*dot_size + y_offset);

      point(0,0);

      pop();
    }
  }

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs