'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

function gui_values(){
  parameterize("cols", 10, 1, 100, 1, false);
  parameterize("rows", 10, 1, 100, 1, false);
} 

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  for(let i=0; i<working_palette.length; i++){
    const c = color(working_palette[i]);
    c.setAlpha(150);
    working_palette[i] = c; 
  }

  const col_step = width/cols;
  const row_step = height/rows;
  const sin_mult = random(-10,10);
  const cos_mult = random(-50,50);
  const weight = SIGNOBROAD*global_scale;
  strokeWeight(weight);
  
  translate(col_step/2, row_step/2);
  
  let sin_counter = 0;
  for(let i=0; i<cols; i++){
    for(let j=0; j<rows; j++){
      push();
      translate(i * col_step, j * row_step);
      sin_counter += random(-sin_mult/2, sin_mult);
      const noise_val = map(noise(i/100, j/100)*4 + sin(sin_counter) + cos(j*cos_mult), -2,6, 0,1);
      if((i+j) % 2 == 0) rotate(map(noise_val, 0,1, -180, 0));
      else rotate(map(noise_val, 0,1, 0, 180));
      let num_lines = floor(map(noise_val, 0,1, 5, 10));
      console.log(num_lines);

      const line_step = row_step/num_lines;
      for(let k=0; k<num_lines; k++){
        push();
        translate(0, k*line_step);
        const starting_val = floor(map(noise_val, 0,1, 0, working_palette.length*2));
        for(let z=0; z<3; z++){
          push();
          rotate(map(noise(i, j, z), 0,1, -20,20));
          // translate(line_step,0);
          stroke(working_palette[(starting_val+z)%working_palette.length]);
          line(0, 0, col_step*2, 0);
          pop();
        }
        pop();
      }
      pop();
    }
  }
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
