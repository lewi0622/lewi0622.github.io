'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

suggested_palettes = [COTTONCANDY, SIXTIES, SUPPERWARE]


function gui_values(){
  parameterize("cols", 10, 1, 50, 1, false);
  parameterize("rows", 20, 1, 50, 1, false);
  parameterize("starting_arch_width", 100, 1, 1000, 1, true);
  parameterize("starting_arch_height", 200, 1, 1000, 1, true);
  parameterize("arch_step_size", random(5,20), 1, 100, 1, true);
}

function setup() {
  common_setup(6*96, 8*96, SVG);
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  const colors = [color("RED"), color("BLUE")];

  const x_step_size = canvas_x*1.5/cols;
  const y_step_size = canvas_y*1.5/rows;

  for(let i=0; i<=cols; i++){
    for(let j=0; j<=rows; j++){
      push();
      let arch_x = starting_arch_width;
      let arch_y = starting_arch_height;

      // arches in order of 0,2,1,4,3,6,5 so every other is on top
      let actual_i;
      if(i==0) actual_i = i;
      else if(i%2 == 1) actual_i = i+1;
      else if(i%2 == 0) actual_i = i-1;

      //y offset for every other arch
      let y_offset = 0;
      if(i%2 == 0 && i != 0) y_offset = arch_y/2; //why is i=0 a special case for the yoffset????
      translate(actual_i*x_step_size, j*y_step_size + y_offset);

      while(arch_x>arch_step_size && arch_y>arch_step_size){
        stroke(colors[i%colors.length]);
        if(i==0) stroke(colors[1]);
        arches(arch_x,arch_y);
        arch_x -= arch_step_size;
        arch_y -= arch_step_size;
      } 
      pop();
    }
  }

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs
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