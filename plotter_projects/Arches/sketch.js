'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [BUMBLEBEE, BIRDSOFPARADISE, SIXTIES];


function gui_values(){
  parameterize("cols", round(random(5,20)), 1, 50, 1, false, grid_slider_1);
  parameterize("rows", round(random(5,20)), 1, 50, 1, false, grid_slider_2);
  parameterize("starting_arch_width", base_x/random(4,25), 1, base_x, 1, true, grid_slider_3);
  parameterize("starting_arch_height", base_y/4 * random(), 1, base_y, 1, true, grid_slider_4);
  parameterize("num_arches", round(random(5, 20)), 1, 50, 1, false);
  parameterize("filled_shapes", 1, 0, 1, 1, false);
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
  const bg_c = random(working_palette);
  reduce_array(working_palette, bg_c);
  if(type == "png") background(bg_c);
  const c1 = random(working_palette);
  reduce_array(working_palette, c1);
  const c2 = random(working_palette);

  const x_step_size = canvas_x*1.5/cols;
  const y_step_size = canvas_y*1.5/rows;
  translate(-starting_arch_width/2, starting_arch_height/2);

  for(let j=0; j<rows; j++){
    for(let i=0; i<cols; i+=2){ //evens
      push();
      stroke(c1);
      if(filled_shapes)fill(c2);
      else noFill();
      translate(i*x_step_size, j*y_step_size);
      arch_column();
      pop();
    }
    for(let i=1; i<=cols; i+=2){ //odds
      push();
      stroke(c2);
      if(filled_shapes) fill(c1);
      else noFill();
      const y_offset = starting_arch_height/2;
      translate(i*x_step_size, j*y_step_size + y_offset);
      arch_column();
      pop();
    }
  }

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs
function arch_column(){
  for(let i=0; i<num_arches; i++){
    arches(lerp(starting_arch_width, 0, i/num_arches), lerp(starting_arch_height, 0, i/num_arches));
  }
}

function arches(arch_width, arch_height){
  beginShape();

  vertex(0,0); //lower middle
  vertex(-arch_width/2, 0); //lower left corner
  // vertex(-arch_width/2,-arch_height*0.75); 
  for(let i=0; i<60; i++){
    const theta = 180+ i*180/60;
    const radius = arch_width/2;
    const x = radius*cos(theta);
    const y = -arch_height + radius*sin(theta);
    vertex(x,y);
  }
  vertex(arch_width/2,0);
  vertex(0,0);

  endShape();
}