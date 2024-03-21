'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 15;

const suggested_palettes = [SUMMERTIME, LASER];

let c_0, c_1, c_2, c_00, c_01, c_02, bg_c;
let theta_offset = 0;
let theta_inc;

function gui_values(){
  parameterize("num_circles", round(random(20, 150)), 1, 300, 1, false, grid_slider_1);
  parameterize("circle_radius", round(random(60, 200)), 1, 300, 1, true, grid_slider_2);
  parameterize("theta_multiplier", random(2,8), 0, 10, 0.1, false, grid_slider_3);
}

function setup() {
  common_setup();
  gui_values();

  working_palette = controlled_shuffle(working_palette, true);
  c_0 = color(working_palette[0]);
  c_1 = color(working_palette[1]);
  c_2 = color(working_palette[2]);
  c_00 = color(random(working_palette));
  c_01 = color(random(working_palette));
  c_02 = color(random(working_palette));
  strokeWeight(1*global_scale);

  bg_c = color(random(working_palette));
  theta_inc = random(3, 8);
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();
  //actual drawing stuff
  push();
  background(bg_c);

  const circle_step_size = (canvas_y+circle_radius)/num_circles;
  translate(canvas_x/2, -circle_radius/2);
  for(let i=0; i<num_circles; i++){
    push();
    refresh_gradient(
      lerpColor(c_0,c_00,i/num_circles),
      lerpColor(c_1,c_01,i/num_circles),
      lerpColor(c_2,c_02,i/num_circles),
      "fill"
    );
    refresh_gradient(lerpColor(c_2,c_02,i/num_circles), undefined, bg_c, "stroke");
    const x = sin(theta_offset + i*theta_multiplier)*canvas_x/3;
    translate(x, circle_step_size*i);
    circle(0,0,map(noise(i/50, theta_offset/500), 0, 1, circle_radius/2, circle_radius*1.5));
    pop();
  } 

  theta_offset += theta_inc;
  pop();

  global_draw_end();
}
//***************************************************
//custom funcs
function refresh_gradient(c1, c2, c3, stroke_or_fill){
  const gradient = drawingContext.createLinearGradient(-circle_radius/2, 0, circle_radius/2, 0);
  if(c1 != undefined) gradient.addColorStop(0,c1);
  if(c2 != undefined) gradient.addColorStop(0.5,c2);
  if(c3 != undefined) gradient.addColorStop(1,c3);
  if(stroke_or_fill == "fill") drawingContext.fillStyle = gradient;
  else drawingContext.strokeStyle = gradient;
}