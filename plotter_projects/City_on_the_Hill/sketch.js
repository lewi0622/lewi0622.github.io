'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
suggested_palettes = []


function gui_values(){
  parameterize("building_min_width", 50, 1, 400, 1, true);
  parameterize("building_max_width", 200, 1, 400, 1, true);
  parameterize("building_x_offset", 80, 0, 100, 1, true);
  parameterize("building_y_offset", 20, 0, 100, 1, true); 
  parameterize("building_min_height", 30, 1, 400, 1, true);
  parameterize("building_max_height", 100, 1, 400, 1, true);
  parameterize("roof_min_height", 5, 1, 50, 1, true);
  parameterize("roof_max_height", 15, 1, 50, 1, true);
  parameterize("hatching_width", 3, 1, 20, 1, true);
  parameterize("hatch_noise_amp", 1, 0, 10, 0.1, true);
}

function setup() {
  common_setup(5*96, 7*96);
}
//***************************************************
function draw() {
  global_draw_start();

  background("WHITE");

  //actual drawing stuff
  push();
  
  let current_x = building_max_width/2;
  while(current_x<canvas_x-building_max_width){
    let current_y = 100*global_scale;
    let max_x = building_min_width;
    while(current_y<canvas_y){
      push();
      const x = current_x + random(-building_x_offset, building_x_offset);
      const y = current_y + random(-building_y_offset, building_y_offset);
      translate(x, y);
      const prev_building_width = draw_building(y); 
      const building_width = random(building_min_width, prev_building_width);
      const building_height = random(building_min_height, building_max_height)
      if(max_x<building_width) max_x = building_width;
      current_y += building_height;
      pop();
    }
    current_x += random(max_x);
  }

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs

function draw_building(y){
  const building_width = random(building_min_width, building_max_width);

  const roof_slope_side = random([-1,1]);
  const roof_height = -random(roof_min_height, roof_max_height);
  const actual_height = canvas_y-y + 10*global_scale; //the 10 is simply to make sure it extends beyond the bottom edge
  //isometric angle at half width
  fill("WHITE");
  rect(0,0, building_width/2, actual_height);
  triangle(0,0, building_width/4,roof_height, building_width/2,0);
  if(roof_slope_side == -1) triangle(building_width/2,0, building_width/4,roof_height, building_width*3/4,roof_height);

  //building shadow side
  noStroke();
  rect(building_width/2, 0, building_width/2, actual_height);

  fill("GREY");
  triangle(building_width/2,0, building_width*3/4,roof_height, building_width,0);
  if(roof_slope_side == 1) triangle(building_width/2,0, building_width/4,roof_height, building_width*3/4,roof_height);

  // rect hatching
  push();
  translate(building_width/2,0);
  noFill();
  stroke("BLACK")
  const z_noise = random(1000);
  const hatch_number = building_width/2 / hatching_width;
  for(let i=0; i<hatch_number; i++){
    push();
    translate(i*hatching_width, 0);
    const hatch_steps = floor(map(actual_height, 0, canvas_y, 0, 100)); //make number of hatching steps consistent for all building heights
    beginShape();
    for(let j=0; j<hatch_steps; j++){
      vertex(map(noise(i,j, z_noise), 0,1, -hatch_noise_amp,hatch_noise_amp), actual_height/hatch_steps*j);
    }
    endShape();
    pop();
  }


  pop();

  return building_width;
}