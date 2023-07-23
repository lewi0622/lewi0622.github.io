'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 5;
const sixteen_by_nine = false;
suggested_palettes = [BEACHDAY, BUMBLEBEE, SIXTIES]
let rotation_per_loop = 0;
let rotation_inc;
let bg_c, c, corner_radius_start, corner_radius_end;
let drift_x_start, drift_x_end, drift_y_start, drift_y_end;
function gui_values(){
  parameterize("num_circles", floor(random(20,100)), 1, 500, 1, false);
  parameterize("starting_radius", random(200,375), 1, 1000, 1, true);
  parameterize("ending_radius", 0, 0, 500, 1, true);
}

function setup() {
  common_setup();
  rotation_inc = map(num_circles, 20, 100, 0.2, 0.1);
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  if(frameCount == 1){
    bg_c = random(working_palette);
    reduce_array(working_palette, bg_c);

    c = random(working_palette);
    bg_c = color(bg_c);
    c = color(c);
    corner_radius_start = random(360);
    corner_radius_end = 360-corner_radius_start;

    drift_x_start = random(-canvas_x/2, 0);
    drift_x_end = random(canvas_x/2);
    drift_y_start = random(-canvas_y/2, 0);
    drift_y_end = random(canvas_y/2);
  }
  background(bg_c);

  rectMode(CENTER);
  translate(canvas_x/2, canvas_y/2);

  fill(bg_c);

  stroke(c);
  let weight = map(num_circles, 50,300, 1,0.1)*global_scale
  strokeWeight(weight);

  drawingContext.shadowBlur = 1*global_scale;


  for(let i=0; i<num_circles; i++){ 
    push();
    let x = map(sin(frameCount), -1,1, drift_x_end, drift_x_start);
    x = lerp(0,x,i/num_circles);
    let y = map(cos(frameCount), -1,1, drift_y_end, drift_y_start);
    y = lerp(0,y,i/num_circles);
    const lerped_color = lerpColor(bg_c, c, constrain(i/num_circles, 0.3, 1));
    // stroke(lerped_color);
    drawingContext.shadowColor = lerped_color;
    translate(x,y);
    rotate(rotation_per_loop*i);

    const radius = lerp(starting_radius, ending_radius, i/num_circles);
    const corner_radius = constrain(map(i/num_circles, 0,1, corner_radius_start, -corner_radius_end), 0, 360);
    square(0, 0, radius, corner_radius, corner_radius, corner_radius, corner_radius);
    pop();
  }

  rotation_per_loop += rotation_inc;

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs