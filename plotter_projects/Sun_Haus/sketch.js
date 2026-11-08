'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [BUMBLEBEE, BIRDSOFPARADISE, SIXTIES];


function gui_values(){
  parameterize("sun_size", random(smaller_base), 0, larger_base, 1, true);
  parameterize("pts", 50, 1, 500, 1, false);
  parameterize("y_step_size", 10, -200, 200, 1, true);
  parameterize("num_ribbons", 20, 2, 100, 1, false);
  parameterize("ribbon_spacing", 10, -200, 200, 1, true);
  parameterize("lines_per_ribbon", 20, 1, 200, 1, false);
  parameterize("i_damp", 50, 1, 200, 1, false);
  parameterize("j_damp", 50, 1, 200, 1, false);
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
  png_bg(true);
  noFill();
  const c = random(working_palette);
  reduce_array(working_palette, c);
  strokeWeight(LEPEN * global_scale);
  const x_step_size = width / pts;

  const line_collection = [];
  for (let j = 0; j < num_ribbons; j++) {
    const my_line = [];
    for (let i = 0; i <= pts; i++) {
      my_line.push(
        map(
          noise(i/i_damp + j/j_damp),
          0,1,
          0,height) +
          y_step_size * j
      );
    }
    line_collection.push(my_line);
  }

  const sun_pt = {
    x: width / 2 + random(-100, 100) * global_scale,
    y: height / 2 + random(-100, 100) * global_scale,
  };
  sun(sun_pt.x, sun_pt.y);

  stroke(c);
  for (let i = 0; i < num_ribbons - 1; i++) {
    push();
    translate(0, i * ribbon_spacing);
    lerp_lines(line_collection[i], line_collection[i + 1], x_step_size);
    pop();
  }

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs
function lerp_lines(line_1, line_2, step_size) {
  for (let i = 0; i < lines_per_ribbon; i++) {
    beginShape();
    for (let j = 0; j < line_1.length; j++) {
      const x = j * step_size;
      const y = lerp(line_1[j], line_2[j], i / lines_per_ribbon);
      splineVertex(x, y);
    }
    endShape();
  }
}

function sun(x, y) {
  push();
  const sun_c = random(working_palette);
  stroke(sun_c);
  fill(sun_c);
  
  circle(x, y, sun_size);
  pop();
}