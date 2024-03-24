'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 8;

const suggested_palettes = [SUPPERWARE];

function gui_values(){
  parameterize("starting_radius", random(smaller_base*3/4, smaller_base/4), 10, 1000, 1, true);
  parameterize("number_of_points", 100, 4, 1000, 1, false);
  parameterize("number_of_rings", 20, 1, 200, 1, false);
  parameterize("max_noise", 5, 0, 1000, 1, false);
  parameterize("x_noise_damp", 1, 1, 1000, 1, false);
  parameterize("y_noise_damp", 1, 1, 1000, 1, false);
  parameterize("x_translate", 0, -1000, 1000, 1, true);
  parameterize("y_translate", 0, -1000, 1000, 1, true);
  parameterize("rotation", 0, 0, 360, 1, false);
  parameterize("power", 1, 0.001, 15, 0.001, false);
}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();

  noFill();
  const bg_c = random(working_palette);
  reduce_array(working_palette, bg_c);
  if(type == "png") background(bg_c);
  const c = color(random(working_palette));
  c.setAlpha(150);
  stroke(c);
  //actual drawing stuff
  push();
  translate(canvas_x/2, canvas_y/2);
  translate(x_translate,y_translate);
  rotate(rotation);
  // strokeWeight(0.04*96);
  strokeWeight(COPICMARKER*1/2);
  //strokejoin, strokecap, etc
  for(let i=0; i<number_of_rings; i++){
    beginShape();
    for(let j=0; j<=number_of_points; j++){
      let r = lerp(starting_radius, 0, i/number_of_rings);
      let theta = j * 360/number_of_points;
      let xoff = map(cos(theta), -1,1, 0, max_noise);
      let yoff = map(sin(theta), -1,1, 0, max_noise);
      r *= noise(xoff/x_noise_damp,yoff/y_noise_damp);
      let x = r*nTimes(Math.sin,pow(cos(theta),power),i);
      let y = r*nTimes(Math.sin,pow(sin(theta),power),i);
      vertex(x,y);
    }
    endShape();
  }


  pop();

  global_draw_end();
}
//***************************************************
//custom funcs


