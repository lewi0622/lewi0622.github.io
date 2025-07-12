'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 5;
const capture = false;
const capture_time = 50/fr;

const suggested_palettes = [];

function gui_values(){
  parameterize("horizontal_amp", base_x/80, 0, base_x/4, 1, true);
  parameterize("vertical_amp", base_y/40, 0, base_x/4, 1, true);
  parameterize("num_squigs", base_x*base_y/80, 0, base_x*base_y/40, 10, false);
}

function setup() {
  common_setup();
  gui_values();
  noFill();
}
//***************************************************
function draw() {
  global_draw_start();
  push();
  if(type=="png") clip(mask);
  const c = color("BLUE");
  c.setAlpha(100);
  stroke(c);
  translate(canvas_x/2, canvas_y/2);
  for (let j = 0; j < 2; j++) {
    for (let i = 0; i < num_squigs; i++) {
      push();
      rotate(j * 180 + random(-40,40));
      translate(canvas_x/4, canvas_y/4);
      curveTightness(random([-5, -5, 0, 5, 5]));
      translate(
        random([-1, 1]) * random(random(canvas_x/3)),
        random([-1, 1]) * random(random(canvas_y/3))
      );
      rotate(random(360));
      squiggle(10, horizontal_amp, vertical_amp, i);

      pop();
    }
  }
  pop();
  if(type=="svg") mask();
  global_draw_end();
}
//***************************************************
//custom funcs
function squiggle(steps, h_amp, v_amp, j) {
  beginShape();
  for (let i = 0; i < steps; i++) {
    const l_r = random([-1, 1, 1]) * h_amp;
    const u_d = random([-1, 1]) * v_amp;
    curveVertex(i * random(h_amp) + noise(i, j) * l_r, noise(i, j) * u_d);
  }
  endShape();
}

function mask(){
  push();
  translate(canvas_x/2, canvas_y/2);
  rotate(30);
  ellipse(0,0, canvas_x*3/4, canvas_x);
  pop();
}