'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
suggested_palettes = [BIRDSOFPARADISE, SUMMERTIME, SIXTIES]


function gui_values(){

}

function setup() {
  common_setup();
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();
  strokeCap(random([PROJECT,ROUND]))

  //apply background
  let bg_c = random(working_palette)
  background(bg_c)
  reduce_array(working_palette, bg_c)

  //actual drawing stuff
  push();
  arcing();
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
function arcing(){
  push();
  noFill();

  translate(canvas_x/2, canvas_y/2);
  let old_SW = 5*global_scale;
  let old_radius = canvas_x/20;
  let radius = 0;
  let angles = random(70, 100);

  rotate(random(0,360));
  while(radius < canvas_x-50*global_scale){
    radius = old_radius+old_SW*2+random(5,6)*global_scale;
    const sw = radius - old_radius - old_SW -5*global_scale;

    stroke(random(working_palette));
    strokeWeight(sw);

    arc(0, 0, radius, radius, 0, angles);
    arc(0, 0, radius, radius, 180, 180+angles);
    rotate(20);

    old_SW = sw;
    old_radius = radius;
  }
  pop();
}


