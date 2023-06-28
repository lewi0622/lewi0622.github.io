'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 8;

function gui_values(){
  parameterize("buildings", 50, 1, 500,);
  parameterize("max_building_width", 50, 0, 1000, 1, true);
  parameterize("min_building_width", 10, 0, 1000, 1, true);
  parameterize("max_building_height", 8*96, 0, 1000, 1, true);
  parameterize("min_building_height", 2*96, 0, 1000, 1, true);
  parameterize("floor_height", 10, 0, 100, 1, true);
}

function setup() {
  common_setup(6*96, 8*96, SVG);
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  translate(0, canvas_y);

  const building_x_step = canvas_x/buildings;
  for(let i=0; i<buildings; i++){
    push();
    translate(building_x_step*i,0);
    let lerped_building_height = lerp(max_building_height, min_building_height, i/buildings);
    let building_height = random(lerped_building_height, max_building_height);
    beginShape();
    vertex(0,0);
    vertex(0,-building_height);
    const actual_width = random(min_building_width, max_building_width);
    vertex(actual_width, -building_height);

    for(let j=0; j<building_height/floor_height; j++){

    }

    endShape(CLOSE);

    pop();
  }

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs


