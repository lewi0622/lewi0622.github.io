'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

suggested_palettes = [BIRDSOFPARADISE, MUTEDEARTH, OASIS]

//project variables
let amp;


function gui_values(){
  parameterize("tile_div", round(random(40,100)), 1, 400, 1, false);
  parameterize("weight", random(1, 7), 0.1, 20, 0.1, true);
  parameterize("num_lines", round(random(3,12)), 1, 15, 1, false);
  parameterize("amp_start", random(1,10), 0.1, 10, 0.1, true);
  parameterize("amp_inc", 0.5, 0, 10, 0.1, true);
  parameterize("tightness", random([-2,-1, 0, 4, 5]), -5, 5, 0.1, false);
}

function setup() {
  common_setup();
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();

  //apply background
  let bg_c = random(working_palette)
  background(bg_c)
  reduce_array(working_palette, bg_c)

  //actual drawing stuff
  push();

  center_rotate(random([0,90,180,270]));

  const tile_x = canvas_x/tile_div;

  strokeWeight(weight);
  translate(0,canvas_y/num_lines/2);
  for(let j=0; j<num_lines; j++){
    stroke(random(working_palette))

    amp = amp_start;

    beginShape();
    noFill();
    curveTightness(tightness);
    curveVertex(-10*global_scale,0);
    curveVertex(-10*global_scale,0);
    for(let i = 0;  i<200; i++){
      const l_r = random([-1,1,1])*tile_x*3;
      const u_d = random([-1,1])*amp;
      curveVertex(i*tile_x+noise(i+j)*l_r, noise(i+j)*u_d);
      amp +=amp_inc;
    }

    endShape();
    translate(0, canvas_y/num_lines);
  }
  pop();
  
  global_draw_end();
}
//***************************************************
//custom funcs
