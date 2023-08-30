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
  parameterize("n_points", random([3,4,5,6,7,8,9,10,11,12,100]), 3, 300, 1, false);
  parameterize("overall_rotation", random(360), 0, 360, 15, false);
  parameterize("rotation_per_shape", random(-5,5), -10, 10, 0.1, false);
  parameterize("point_1_x", random(50, 650), -500, 1500, 1, true);
  parameterize("point_2_x", random(50, 650), -500, 1500, 1, true);
  parameterize("point_3_x", random(50, 650), -500, 1500, 1, true);
  parameterize("point_4_x", random(50, 650), -500, 1500, 1, true);
  parameterize("point_5_x", random(50, 650), -500, 1500, 1, true);
  parameterize("point_1_y", random(50, 450), -500, 1500, 1, true);
  parameterize("point_2_y", random(50, 450), -500, 1500, 1, true);
  parameterize("point_3_y", random(50, 450), -500, 1500, 1, true);
  parameterize("point_4_y", random(50, 450), -500, 1500, 1, true);
  parameterize("point_5_y", random(50, 450), -500, 1500, 1, true);
  parameterize("radius_1", random(50), 0, 500, 1, true);
  parameterize("radius_2", random(250), 0, 500, 1, true);
  parameterize("radius_3", random(250), 0, 500, 1, true);
  parameterize("radius_4", random(250), 0, 500, 1, true);
  parameterize("radius_5", random(50), 0, 500, 1, true);
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
    rotate(overall_rotation);
    rotate(i*rotation_per_shape);
    //add options for RECT with/out rounded corners and ellipses
    polygon(0,0,rad, n_points);
    pop();
  }
  pop();

  global_draw_end();
}
//***************************************************
//custom funcs

