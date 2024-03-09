'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 8;


function gui_values(){
  parameterize("num_ravine_shapes", 200, 1, 300, 1, false);
  parameterize("horizontal_amp", 100, 1, 200, 1, true);
  parameterize("horizontal_steps", 100, 1, 200, 1, false);
  parameterize("ravine_steps", 100, 1, 200, 1, false);
  parameterize("ravine_height", canvas_y, 1, canvas_y, 1, true);
  parameterize("vertical_amplitude", 20, 0, 100, 1, true);
  parameterize("total_perspective_x_shift", 50, -100, 100, 1, true);
}

function setup() {
  common_setup();
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  background("WHITE");
  //todo break into functions for horizontal surfaces (flat lines for now)
  // Function for vertical surface, with a given start and end point, add option for reversal, add option for noise offset to allow for noise variation within same vertical surface
  // Set up for rotation by drawing sized to sqrt(2*longestside^2) centered on canvas

  // translate(0, 0);
  // center_rotate(20);
  //ravine is middle third of screen
  const shape_step_size = canvas_y/num_ravine_shapes;
  const perspective_x_shift = total_perspective_x_shift/num_ravine_shapes;
  const river_width = 10;
  for(let j=0; j<num_ravine_shapes; j++){
    push();
    const horizontal_base = map(noise(j/100), 0,1, -horizontal_amp, horizontal_amp);
    const horizontal_step_size = lerp(canvas_x/2,0, j/num_ravine_shapes) / horizontal_steps;
    translate(-horizontal_amp - j*perspective_x_shift, shape_step_size*j);
    //left bank
    beginShape();
    let final_x, final_y;
    for(let i=0; i<horizontal_steps; i++){
      const x = i * horizontal_step_size + horizontal_base;
      const y = 0;
      vertex(x,y);
      if(i+1 == horizontal_steps){
        final_x = x;
        final_y = y;
      }
    }
    //Vertical
    const ravine_step_size = ravine_height/ravine_steps;
    for(let i=0; i<ravine_steps; i++){
      let x = map(noise(i/10,j/100), 0,1, 0, lerp(vertical_amplitude, vertical_amplitude*2, i/ravine_steps)) + final_x;
      // if(i/ravine_steps>0.25){
      //   x = lerp(x, canvas_x, map(i/ravine_steps, 0.25,1, 0,1));
      // }
      const y = i * ravine_step_size + final_y;
      vertex(x,y);
      if(i+1 == ravine_steps) final_y = y;
    }
    //offscreen left
    vertex(canvas_x*1.5, final_y);
    vertex(canvas_x*1.5, canvas_y + 1);
    vertex(-1, canvas_y + 1);
    
    // vertex(0, final_y)
    endShape(CLOSE);
    pop();
  }

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs
function horizontal_land(start_x, start_y, end_x, end_y){
  
}

