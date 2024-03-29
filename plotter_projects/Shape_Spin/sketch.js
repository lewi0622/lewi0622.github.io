'use strict';

//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [BIRDSOFPARADISE, SUMMERTIME, SOUTHWEST];

function gui_values(){
  parameterize("number_of_shapes", floor(random(30,100)), 1, 100, 1, false);
  parameterize("rotation_per_shape", round(random(-45,45)), -45, 45, 1, false);
  parameterize("starting_radius", smaller_base/random(2,4), 0, smaller_base, 1, true);
  parameterize("fill_shape", round(random()), 0, 1, 1, false);
  parameterize("polygon_n_sides", floor(random(3,13)), 3, 100, 1, false);
  parameterize("number_of_passes", floor(random(1,10)), 1, 200, 1, false);
  parameterize("spacing_per_pass", random(0.5,5), 0.1, 10, 0.1, true);
  parameterize("negative_spacing", 0, 0, 1, 1, false);
  parameterize("num_colors", random(2,working_palette.length-2), 1, working_palette.length-2, 1, false);
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
  strokeWeight(1*global_scale);
  const bg_c = png_bg(true);
  if(type == "png") fill(bg_c);
  controlled_shuffle(working_palette, true);
  const colors = [];
  for(let i=0; i<num_colors; i++){
    colors.push(working_palette[i]);
  }
  if(!fill_shape) noFill();
  translate(canvas_x/2, canvas_y/2);
  for(let i=0; i<number_of_shapes; i++){
    rotate(rotation_per_shape);
    const stroke_c = color(random(colors));
    stroke(stroke_c);
    if(type == "png") line_blur(stroke_c, 2*global_scale);
    const radius = lerp(starting_radius, 0, i/number_of_shapes);
    for(let j=0; j<number_of_passes; j++){
      let pass_radius = radius - j*spacing_per_pass;
      if(!negative_spacing && pass_radius<0) continue;
      polygon(0,0,pass_radius,polygon_n_sides);
    }

  }

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs