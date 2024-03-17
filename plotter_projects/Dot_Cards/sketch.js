'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 8;


function gui_values(){
  parameterize("num_pts", 50, 1, 200, 1, false);
}

function setup() {
  common_setup();
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  const colors = ["RED", "YELLOW", "GREEN"];
  translate(canvas_x/6, canvas_y/2);

  const radius = 0.75*96;

  for(let i=0; i<3; i++){
    push();
    stroke(colors[i]);
    translate(i * canvas_x/3, 0);

    beginShape();
    for(let j=0; j<num_pts; j++){
      const theta = j*(45 + j);
      const x = radius * cos(theta);
      const y = radius * sin(theta);
      vertex(x,y);
    }
    endShape();

    pop();
  }

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs