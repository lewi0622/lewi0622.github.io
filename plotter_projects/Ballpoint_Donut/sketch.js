'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 5;
const capture = false;
const capture_time = 50/fr;

const suggested_palettes = [];

function gui_values(){
  parameterize("num_rings", base_x/20, 0, base_x/10, 1, false);
  parameterize("starting_ring_steps", base_x/2, 0, base_x, 1, false);
  parameterize("ending_ring_steps", base_x * 4, 0, base_x * 20, 100, false);
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
  const bg_c = color("PURPLE");
  const starting_radius = 0;
  const ending_radius = canvas_x;

  if(type=="png") clip(mask);

  const c = color("BLUE");
  c.setAlpha(200);
  stroke(c);

  translate(canvas_x / 2, canvas_y / 2);

  for (let i = 0; i < num_rings; i++) {
    let ring_steps;
    if (i / num_rings > 0.5)
      ring_steps = lerp(
        starting_ring_steps,
        ending_ring_steps,
        map(i / num_rings, 0.5, 1, 0, 1)
      );
    else ring_steps = starting_ring_steps;

    const angle_step = 360 / ring_steps;
    for (let j = 0; j < ring_steps; j++) {
      push();
      const radius = lerp(starting_radius, ending_radius, i / num_rings);
      const theta = j * angle_step;
      const x = radius * cos(theta);
      const y = radius * sin(theta);
      translate(x, y);
      rotate(random(360));
      squiggle(10, 10*global_scale, 10*global_scale, j);
      pop();
    }
  }
  stroke(bg_c);
  fill(bg_c);
  // circle(0, 0, 100);
  pop();
  // if(type=="svg") mask();
  global_draw_end();
}
//***************************************************
//custom funcs
function squiggle(steps, h_amp, v_amp, j) {
  curveTightness(random([-5, -5, 0, 5, 5]));
  beginShape();
  for (let i = 0; i < steps; i++) {
    const l_r = random([-1, 1, 1]) * h_amp;
    const u_d = random([-1, 1]) * v_amp;
    const x = i * random(h_amp) + noise(i, j) * l_r;
    const y = noise(i, j) * u_d;
    curveVertex(x, y);
  }
  endShape();
}

function mask(){
  push();
  translate(canvas_x / 2, canvas_y / 2);
  circle(0, 0, canvas_x);
  pop();
}