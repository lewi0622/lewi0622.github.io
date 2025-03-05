'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

function gui_values(){
  // parameterize("rows", 10, 1, 50, 1, false);
  // parameterize("cols", 10, 1, 50, 1, false);
  // parameterize("x_spacing", base_x/cols/2, 0, base_x, 1, true);
  // parameterize("y_spacing", base_y/rows/2, 0, base_y, 1, true);
  // parameterize("min_step_pct", 0.05, 0, 1, 0.01, false);
  // parameterize("max_step_pct", 0.5, 0, 1, 0.01, false);
  parameterize("min_iterations", 0, 0, 100, 1, false);
  parameterize("max_iterations", 100, 1, 1000, 1, false);
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
  noFill();
  for(let k=2; k<6; k+=2){
    push();
    const rows = k;
    const cols = k;
    const x_spacing = 0.1 * (canvas_x/cols);
    const y_spacing = 0.1 * (canvas_y/rows);

    const grid_width = (canvas_x - x_spacing * (cols+1))/cols;
    const grid_height = (canvas_y - y_spacing * (rows+1))/rows;
    const x_step = x_spacing + grid_width;
    const y_step = y_spacing + grid_height;

    const min_step_pct = 0;
    const max_step_pct = random(0.2, 0.5);
    
    translate(x_spacing, y_spacing);
    for(let i=0; i<cols; i++){
      for(let j=0; j<rows; j++){
        push();
        translate(i * x_step, j * y_step);
        for(let pens=0; pens<2; pens++){
          let num_iterations;
          if(pens%2==0){
            strokeWeight(POSCA*global_scale);
            num_iterations = random(min_iterations, max_iterations/2);
          }
          else{
            strokeWeight(PILOTPRECISEV5*global_scale);
            num_iterations = random(min_iterations, max_iterations);
          }
          stroke(random(working_palette));
          rect(0,0,grid_width, grid_height);
          if(random()>0.9){
            const amt = random(-0.05,0.05)
            rect(amt*grid_width, amt*grid_height, grid_width, grid_height);
          }
          scribble(grid_width, grid_height, random([0, num_iterations, num_iterations, num_iterations]), min_step_pct, max_step_pct);
        }
        pop();
      }
    }
    pop();
  }
  
  pop();

  global_draw_end();
}
//***************************************************
//custom funcs
function scribble(w, h, iterations, min_pct, max_pct){
  const min_step_size = min_pct * min(w,h);
  const max_step_size = max_pct * min(w,h);

  let x = random(w);
  let y = random(h);

  beginShape();
  for(let i=0; i<iterations; i++){
    const theta = random(360);
    const radius = random(min_step_size, max_step_size);
    x += radius * cos(theta);
    y += radius * sin(theta);
    x = constrain(x,0,w);
    y = constrain(y,0,h);

    curveVertex(x,y);
  }
  endShape();
}