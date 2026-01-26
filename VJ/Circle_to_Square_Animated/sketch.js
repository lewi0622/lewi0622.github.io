'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 20;

const suggested_palettes = [BEACHDAY, BUMBLEBEE, SIXTIES]
let rotation_inc, rotation_per_loop;
let bg_c, c, corner_radius_start, corner_radius_end;
let drift_x_start, drift_x_end, drift_y_start, drift_y_end;
let cornering_start, cornering_end;
function gui_values(){
  parameterize("num_circles", floor(random(20,100)), 1, 500, 1, false);
  parameterize("starting_radius", random(200,375), 1, 1000, 1, true);
  parameterize("ending_radius", 0, 0, 500, 1, true);
}

function setup() {
  common_setup();
  gui_values();
  rotation_per_loop = 0;
  rotation_inc = map(num_circles, 20, 100, 0.2, 0.1);

  bg_c = random(working_palette);
  reduce_array(working_palette, bg_c);

  c = random(working_palette);
  bg_c = color(bg_c);
  c = color(c);

  drift_x_start = -canvas_x/2
  drift_x_end = canvas_x/2;
  drift_y_start = 0//random(-canvas_y/2, 0);
  drift_y_end = 0//random(canvas_y/2);

  cornering_start = constrain(random(), 0, 0.5);
  cornering_end = random(-1, 0.25);
  document.body.style.background = color("BLACK");
  pixelDensity(2);
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();

  rectMode(CENTER);
  translate(canvas_x/2, canvas_y/2);

  let weight = map(num_circles, 50,300, 1,0.1)*global_scale
  strokeWeight(weight);

  for(let i=0; i<num_circles; i++){ 
    push();
    let x = map(sin(angle_loop(fr, capture_time, 1)), -1,1, drift_x_end, drift_x_start);
    x = lerp(0,x,i/num_circles);
    let y = map(cos(angle_loop(fr, capture_time, 1)), -1,1, drift_y_end, drift_y_start);
    y = lerp(0,y,i/num_circles);

    translate(x,y);
    rotate(angle_loop(fr, capture_time, 1)*i);

    const radius = lerp(starting_radius, ending_radius, i/num_circles);
    // const corner_radius = constrain(map(i/num_circles, 0,1, corner_radius_start, -corner_radius_end), 0, 360);
    let corner_radius = constrain(lerp(radius*cornering_start, radius*cornering_end, (i+1)/num_circles), 0, starting_radius);
    erase(255,0);
    square(0, 0, radius, corner_radius, corner_radius, corner_radius, corner_radius);
    noErase();
    noFill();
    stroke("WHITE");
    square(0, 0, radius, corner_radius, corner_radius, corner_radius, corner_radius);
    pop();
  }

  rotation_per_loop += rotation_inc;
  pop();

  global_draw_end();
}
//***************************************************
//custom funcs