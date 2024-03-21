'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 15;

const suggested_palettes = [COTTONCANDY, BIRDSOFPARADISE, SUMMERTIME, SOUTHWEST, SIXTIES, LASER];

let c_0, c_1, c_2, c_00, c_01, c_02, bg_c;

function gui_values(){
  parameterize("num_circles", round(random(20, 300)), 1, 1500, 1, false);
  parameterize("circle_radius", round(random(60, 200)), 1, 300, 1, true);
  parameterize("theta_multiplier", random(2,8), 0, 10, 0.1, false);
}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  working_palette = controlled_shuffle(working_palette, true);
  c_0 = color(working_palette[0]);
  c_1 = color(working_palette[1]);
  c_2 = color(working_palette[2]);
  c_00 = color(random(working_palette));
  c_01 = color(random(working_palette));
  c_02 = color(random(working_palette));
  strokeWeight(1*global_scale);

  bg_c = color(random(working_palette));

  background(bg_c);
  center_rotate(random(360));
  const circle_step_size = (canvas_y+circle_radius)/num_circles;
  translate(canvas_x/2, -circle_radius/2);
  for(let i=0; i<num_circles; i++){
    push();
    set_linear_gradient([
      lerpColor(c_0,c_00,i/num_circles),
      lerpColor(c_1,c_01,i/num_circles),
      lerpColor(c_2,c_02,i/num_circles),
      ],
      -circle_radius/2, 0, circle_radius/2, 0,
      "fill"
    );

    set_linear_gradient([lerpColor(c_2,c_02,i/num_circles), bg_c], -circle_radius/2, 0, circle_radius/2, 0, "stroke");
    const x = sin(i*theta_multiplier)*canvas_x/3;
    push();
    translate(x, circle_step_size*i);
    circle(0,0, circle_radius);
    
    pop();
  } 

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs
