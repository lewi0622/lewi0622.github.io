'use strict';

//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

function gui_values(){
  parameterize("spine_steps", 200, 1, 1000, 1, false);
  parameterize("amp", 10, 0, 200, 1, true);
  parameterize("minimum_block_steps", 20, 0, 100, 1, false);
  parameterize("radiated_radius", base_x, 0, base_x*2, 1, true);
}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();
  push();
  noFill();
  translate(canvas_x/2, -canvas_y);
  const step_size = canvas_y*3/spine_steps;

  const colors = [];
  working_palette = controlled_shuffle(working_palette, true);
  for(let i=0; i<2; i++){
    colors.push(color(working_palette[i]));
  }

  strokeWeight(SIGNOBROAD);
  for(let j=0; j<2; j++){
    const theta = j*180 + random(-30,30);
  
    let block_step = 0;
    let color_index = 0;
  
    beginShape();
    for(let i=0; i<spine_steps; i++){
      //spine
      const x = amp*sin(i*5);
      const y = i*step_size;
      vertex(x,y);
      
      //light block
      if(block_step>minimum_block_steps && random()>0.9){ //reset with new color
        block_step = 0;
        color_index++;
      }
      stroke(colors[color_index%colors.length]);
      const end_x = radiated_radius*cos(theta);
      const end_y = canvas_y*1.5 + radiated_radius*sin(theta);
      line(x,y, end_x,end_y);
      block_step++;
    }
    stroke("BLACK");
    endShape();
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs