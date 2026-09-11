'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [BUMBLEBEE];


function gui_values(){
  parameterize("overall_radius", random(0.4, 1.2) * smaller_base*0.4, 0, smaller_base, 1, true);

  parameterize("rounds", floor(random(10,50)), 1, 200, 1, false);
  parameterize("symmetries", floor(random(10,50)), 1, 100, 1, false);
  parameterize("sides", floor(random(4,16)), 1, 100, 1, false);
  parameterize("poly_radius", smaller_base * random(1/10, 1/4), 1, 200, true);
  parameterize("x_loc", base_x/2, 0, base_x, 1, true);
  parameterize("y_loc", base_y/2, 0, base_y, 1, true);
  parameterize("tri_width", random(base_x/4,base_x/2), 0, base_x*2, 1, true);
} 

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();
  push();
  png_bg(true);

  noFill();
  const c = color(random(working_palette));
  c.setAlpha(BICCRISTAL_ALPHA);

  stroke(c);
  strokeWeight(BICCRISTAL*global_scale);

  translate(x_loc, y_loc);
  const angle_step = 360 / symmetries;

  for(let i=0; i<rounds; i++){
    const radius = lerp(0, overall_radius, i/rounds);
    symmetry(radius, angle_step);
  }

  const tri_c = random(working_palette);
  stroke(tri_c);
  fill(tri_c);
  triangle(0,0, tri_width/2, height-y_loc, -tri_width/2, height-y_loc);

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs

function symmetry(radius, angle_step){
  for(let i=0; i<symmetries; i++){
    const theta = i * angle_step;
    const x = radius * cos(theta);
    const y = radius * sin(theta);
    push();
    translate(x,y);
    rotate(random(360));
    polygon(0, 0, poly_radius, sides);
    pop();
  }
}

