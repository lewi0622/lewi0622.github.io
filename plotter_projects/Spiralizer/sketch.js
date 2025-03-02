'use strict';
//setup variables
let gif = false;
let animation = false;
const fr = 30;
const capture = false;
const capture_time = 72/30;

const suggested_palettes = [];

function gui_values(){
  parameterize("steps", 500, 1, 1000, 1, false);
  parameterize("layers", round(random(2, working_palette.length-1)), 1, working_palette.length-1, 1, false);
  parameterize("angle_step_size", random(-20,20), -20, 20, 0.1, false);
  parameterize("radius_step_size", random(0.25,1), 0, 20, 0.1, true);
  parameterize("min_circle_radius", random(2,10), 0, 20, 0.1, true);
  parameterize("max_circle_radius", random(75, 150), 0, 500, 1, true);
  parameterize("radius_noise_damp", random(50,300), 1, 1000, 1, false);
}

function setup() {
  common_setup();
  // pixelDensity(15);
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();
  push();
  rectMode(CENTER);
  colorMode(RGB);
  strokeWeight(2*global_scale);
  png_bg(true);
  colorMode(HSB);
  refresh_working_palette();
  const colors = [];
  const s = random(40, 100);
  for(let i=0; i<layers; i++){
    let c = random(working_palette);
    reduce_array(working_palette, c);
    c = RGBA_to_HSBA(...c);
    c[2] = 100;
    c[1] = s;
    colors.push(color(c));
  }
  translate(canvas_x/2, canvas_y/2);
  noStroke();
  for(let j=0; j<layers; j++){
    // stroke(working_palette[j]);
    // if(type == "png") fill(colors[j]);
    for(let i=0; i<steps; i++){
      push();
      if(i%2==0) blendMode(MULTIPLY);
      const x = (min_circle_radius + radius_step_size*i)*cos(angle_step_size*i);
      const y = (min_circle_radius + radius_step_size*i)*sin(angle_step_size*i);
      const size = map(noise(i/radius_noise_damp, j), 0,1, min_circle_radius, lerp(min_circle_radius,max_circle_radius, i/steps));
      set_linear_gradient(colors, -size/2, -size/2, size/2, size/2, "fill");
      translate(x,y);
      rotate(i);
      square(0,0,size, map(noise(i,j), 0,1, 0, 20));
      pop();
    }
  }
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs