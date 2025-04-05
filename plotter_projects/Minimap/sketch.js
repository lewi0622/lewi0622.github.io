'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 20;

const suggested_palettes = [];

let grid_step;

function gui_values(){
  parameterize("cols", random(2,30), 1, 500, 1, false);
  parameterize("layers", 1, 1, 10, 1, false);
  parameterize("weight", random(1,3), 0.01, 10, 0.01, true);
  parameterize("x_damp", random(10,25), 1, 500, 1, false);
  parameterize("y_damp", random(10,25), 1, 500, 1, false);
  const margin = random(120,250);
  parameterize("x_margin", margin, -base_x, base_x, 1, true);
  parameterize("y_margin", margin, -base_y, base_y, 1, true);
  parameterize("rotation", random([0, 45]), 0, 360, 1, false);
  parameterize("num_colors", round(random(2, working_palette.length-1)), 1, working_palette.length-1, 1, false);
} 

function setup() {
  common_setup();
  // pixelDensity(15);
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();
  push();
  noFill();
  strokeWeight(weight);
  refresh_working_palette();
  working_palette = controlled_shuffle(working_palette, true);
  const bg_c = png_bg(true);
  const colors = [];
  for(let i=0; i<num_colors; i++){
    colors.push(color(working_palette[i]));
    // colors[i].setAlpha(150);
  }

  center_rotate(rotation);

  grid_step = (canvas_x-x_margin)/cols;
  const my_funcs = controlled_shuffle([draw_circle, draw_diamond, draw_x, draw_vert_lines, draw_horizontal_lines, draw_horizontal_squiggle_lines]);
  const rows = ceil((canvas_y-y_margin)/grid_step);
  // const rows = cols;
  // blendMode(MULTIPLY);
  translate(x_margin/2, y_margin/2);
  for(let k=0; k<layers; k++){
    for(let i=0; i<cols; i++){
      for(let j=0; j<rows; j++){
        push();
        translate(i*grid_step, j*grid_step);
        const index = floor(map(noise(i*grid_step/x_damp, j*grid_step/y_damp, k), 0,1, 0, my_funcs.length));
        stroke(colors[index%colors.length]);
        // stroke(random(colors));
        my_funcs[index]();
        pop();
      }
    }
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
function draw_circle(){
  const size = grid_step;
  circle(size/2, size/2, size);
  circle(size/2, size/2, size*2/3);
  circle(size/2, size/2, size/3);
  // circle(size/2*(1 + random(-0.25,0.25)), size/2*(1+random(-0.25,0.25)), size/2);
}

function draw_x(){
  const size = grid_step;
  line(0,0,size,size);
  line(size, 0, 0, size);
}

function draw_square(){
  const size = grid_step;
  square(0,0,size);
}

function draw_diamond(){
  const size = grid_step;
  beginShape();
  vertex(size/2, 0);
  vertex(size, size/2);
  vertex(size/2,size);
  vertex(0, size/2);
  endShape(CLOSE);
}

function draw_vert_lines(){
  const size = grid_step;
  let step_size = weight*2; //approximate step size
  const num_lines = floor(size/step_size);
  step_size = size/num_lines; //actual step_size
  translate(step_size/2,0);
  for(let i=0; i<num_lines; i++){
    push();
    translate(i*step_size,0);
    line(0,0, 0,size);
    pop();
  }
}

function draw_horizontal_lines(){
  push();
  rotate_tile_90();
  draw_vert_lines();
  pop();
}

function draw_horizontal_squiggle_lines(){
  const size = grid_step;
  let step_size = weight*2; //approximate step size
  const num_lines = floor(size/step_size);
  step_size = size/num_lines; //actual step_size
  translate(0, step_size/2);
  for(let i=0; i<num_lines; i++){
    push();
    noFill();
    translate(0,i*step_size);
    beginShape();
    const num_steps = 360;
    for(let j=0; j<num_steps; j++){
      const x = lerp(0, size, j/num_steps);
      const y = weight*sin(j);
      vertex(x,y);
    }
    endShape();
    pop();
  }
}

function draw_vertical_squiggle_lines(){
  push();
  rotate_tile_90();
  draw_horizontal_squiggle_lines();
  pop();
}

function rotate_tile_90(){
  translate(grid_step/2, grid_step/2);
  rotate(90);
  translate(-grid_step/2, -grid_step/2);
}