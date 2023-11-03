'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

suggested_palettes = []


function gui_values(){
  parameterize("radius", 70, 1, 400, 1, true);
  parameterize("number_of_tubes", floor(random(4,12)), 1, 20, 1, false);
  parameterize("tube_steps", 200, 1, 1000, 1, false);
  parameterize("starting_tube_spacing", 1, 1, 30, 0.1, true);
  // parameterize("mid_tube_spacing", 10, 0, 30, 0.1, true);
  parameterize("ending_tube_spacing", 1, 0, 30, 0.1, true);
  parameterize("x_sin_amp", 10, 0, 50, 1, true);
}

function setup() {
  common_setup(5*96, 7*96, SVG);
}
//***************************************************
function draw() {
  global_draw_start();


  //actual drawing stuff
  push();
  noFill();
  let cs = gen_n_colors(number_of_tubes);
  cs.forEach(c => {
    c.setAlpha(100);
  });

  const odd_tube_out = floor(random(number_of_tubes));
  const tube_x_spacing = canvas_x/number_of_tubes;
  for(let i=0; i<number_of_tubes; i++){
    push();
    stroke(cs[i]);
    // if(i==odd_tube_out) translate(0, 50);
    for(let j=0; j<tube_steps; j++){
      const tube_y_spacing = lerp(starting_tube_spacing, ending_tube_spacing, j/tube_steps);
      push();
      translate(x_sin_amp*sin(j) + tube_x_spacing*i, tube_y_spacing*j);
      circle(0,0, radius);
      pop();
    }
    pop();
  }


  pop();

  global_draw_end();
}
//***************************************************
//custom funcs

