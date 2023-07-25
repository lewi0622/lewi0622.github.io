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
  parameterize("number_of_circles", 100, 1, 1000, 1, false);
  parameterize("n_points", 3, 3, 300, 1, false);
  parameterize("shape_rotation", 0, 0, 360, 15, false);
  parameterize("point_1_x", 50, -500, 1500, 1, true);
  parameterize("point_2_x", 150, -500, 1500, 1, true);
  parameterize("point_3_x", 300, -500, 1500, 1, true);
  parameterize("point_4_x", 450, -500, 1500, 1, true);
  parameterize("point_5_x", 600, -500, 1500, 1, true);
  parameterize("point_1_y", 0, -500, 1500, 1, true);
  parameterize("point_2_y", 0, -500, 1500, 1, true);
  parameterize("point_3_y", 0, -500, 1500, 1, true);
  parameterize("point_4_y", 0, -500, 1500, 1, true);
  parameterize("point_5_y", 0, -500, 1500, 1, true);
  parameterize("radius_1", 0, 0, 500, 1, true);
  parameterize("radius_2", random(300), 0, 500, 1, true);
  parameterize("radius_3", random(300), 0, 500, 1, true);
  parameterize("radius_4", random(300), 0, 500, 1, true);
  parameterize("radius_5", 0, 0, 500, 1, true);
}

function setup() {
  common_setup(7*96, 5*96, SVG);
}
//***************************************************
function draw() {
  global_draw_start();


  //actual drawing stuff
  push();
  for(let i=0; i<number_of_circles; i++){
    let pt1, pt2, rad_1, rad_2;
    if(i/number_of_circles<0.25){
      pt1 = {x: point_1_x, y: point_1_y};
      pt2 = {x: point_2_x, y: point_2_y};
      rad_1 = radius_1;
      rad_2 = radius_2; 
    }
    else if(i/number_of_circles>=0.25 && i/number_of_circles<0.5){
      pt1 = {x: point_2_x, y: point_2_y};
      pt2 = {x: point_3_x, y: point_3_y};
      rad_1 = radius_2;
      rad_2 = radius_3; 
    }
    else if(i/number_of_circles>=0.5 && i/number_of_circles<0.75){
      pt1 = {x: point_3_x, y: point_3_y};
      pt2 = {x: point_4_x, y: point_4_y};
      rad_1 = radius_3;
      rad_2 = radius_4; 
    }
    else{
      pt1 = {x: point_4_x, y: point_4_y};
      pt2 = {x: point_5_x, y: point_5_y};
      rad_1 = radius_4;
      rad_2 = radius_5; 
    }

    const x = lerp(pt1.x, pt2.x, 4*i/number_of_circles%1);
    const y = lerp(pt1.y, pt2.y, 4*i/number_of_circles%1);
    const rad = lerp(rad_1, rad_2, 4*i/number_of_circles%1);
    push();
    translate(x,y);
    rotate(shape_rotation);
    polygon(0,0,rad, n_points);
    pop();
  }
  pop();

  global_draw_end();
}
//***************************************************
//custom funcs

