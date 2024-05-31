'use strict'
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [GAMEDAY, SOUTHWEST, SIXTIES, JAZZCUP, LASER];


function gui_values(){
  parameterize("num_circles", round(random(2000,10000)), 1, 20000, 1, false);
  parameterize("opacity", random(2,3), 0, 100, 1, false);
  parameterize("rows", floor(random(3,6)), 1, 10, 1, false);
  parameterize("num_colors", round(random(3, working_palette.length)), 3, working_palette.length, 1, false);
}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();
  push();
  background("WHITE");

  const radius = ceil(canvas_y/rows);
  const step_size = (canvas_x-radius)/num_circles;

  for(let j=0; j<rows; j++){
    push();
    translate(radius/2, radius/2 + j*radius);
    refresh_working_palette();
    const colors = [];
    for(let i=0; i<num_colors; i++){
      let c = random(working_palette);
      reduce_array(working_palette, c);
      c = color(c);
      c.setAlpha(opacity);
      colors.push(c);
    }
  
    noStroke();
    for(let i=0; i<num_circles; i++){
      const x = map(noise(j, i/1000), 0,1, 0, radius/4);
      const y = map(noise(j, i/1000 + 1000), 0,1, 0, radius/4);
      set_linear_gradient(colors, x,y , 0, radius/4, "fill");
  
      blendMode([MULTIPLY, BLEND][i%2]);
      push();
      translate(i*step_size, 0);
      circle(0,0,radius);
      pop();
    }
    pop();
  }
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs