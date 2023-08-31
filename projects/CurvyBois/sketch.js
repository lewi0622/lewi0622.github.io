'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

suggested_palettes = []

function gui_values(){
  parameterize("points_number", 100, 1, 1000, 1, false);
  parameterize("radius", 200, 1, 1000, 1, true);
  parameterize("number_of_sins", 0, 0, 100, 1, false);
  parameterize("power", 1, 1, 100, 2, false);
}

function setup() {
  common_setup();
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();

  //apply background
  let bg_c = random(working_palette);
  background(bg_c)
  reduce_array(working_palette, bg_c)

  //actual drawing stuff
  push();
  noFill();
  translate(canvas_x/2, canvas_y/2);
  // angleMode(DEGREES);
  // print("Degree Mode");
  // print(sin(sin(100)));
	// angleMode(RADIANS);
  // print(sin(sin(radians(100))));
  
	// beginShape();
	 
	// for (let u=0; u<=2*PI + 3*PI/12; u+=PI/12) {
	//    curveVertex(nTimes(sin, cos(u), number_of_sins)*radius, nTimes(sin, sin(u), number_of_sins)*radius); 
	// }
	// endShape();
  // // 
  beginShape();

  for(let i=0; i<points_number+3; i++){
    let theta = i*360/points_number;
    let x = radius*nTimes(Math.tan,pow(cos(theta),power),number_of_sins);
    let y = radius*nTimes(Math.tan,pow(sin(theta),power),number_of_sins);

    curveVertex(x,y);
  }

  endShape();

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs




