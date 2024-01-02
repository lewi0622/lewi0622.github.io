'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

suggested_palettes = []

function gui_values(){
  parameterize("num_circles", 100, 1, 500, 1, false);
  parameterize("circle_steps", 100, 3, 300, 1, false);
} 

function setup() {
  common_setup(6*96, 8*96);
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();

  //actual drawing stuff
  push();
  noFill();
  const ang_step = 360/circle_steps;
  translate(canvas_x/2, canvas_y/2);
  for(let i=0; i<num_circles; i++){
    // rotate(map(noise(i/1000), 0,1, 0,360));
    beginShape();
    let radius = (i/10 + 50)*global_scale;
    let actual_steps = random(circle_steps/2, circle_steps);
    for(let j=0; j<actual_steps; j++){
      const theta = j*ang_step;
      radius += 0.1 + (i+j)/100;
      let x = radius*cos(theta);
      let y = radius*sin(theta);

      vertex(x,y);
    }
    endShape();
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs