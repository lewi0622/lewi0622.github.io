'use strict';

//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

function gui_values(){
  parameterize("num_swirls", 10, 1, 100, 1, false);
}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();
  push();

  const weight = SIGNOBROAD * global_scale;
  strokeWeight(weight);
  noFill();

  const margin = 60*weight/4;

  for(let i=0; i<num_swirls; i++){
    push();
    stroke(random(working_palette));
    translate(random(margin, canvas_x-margin), random(margin, canvas_y-margin));

    const num_arcs = floor(random(30, 60));
    const arc_width = num_arcs * weight/2;
    rotate(random([0,180]));
    for(let j=0; j<num_arcs; j++){
      const start_angle = map(abs(sin((j+1)*10)), 0,1, 80, 100);
      const end_angle = map(abs(sin((j+1)*10)), 0,1, 280, 260);
      const adjusted_width = arc_width-j*weight/2;
      arc(0,0, adjusted_width, adjusted_width, start_angle, end_angle, OPEN);
      const pct = j/num_arcs;
      if(pct > 0.9){
        line(0, adjusted_width/2, arc_width, adjusted_width/2);
        line(0, -adjusted_width/2, arc_width, -adjusted_width/2);
      }

    }
    pop();
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
