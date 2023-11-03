'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

suggested_palettes = []


function gui_values(){
  parameterize("petal_width", 10, 1, 50, 1, true);
  parameterize("petal_height", 30, 1, 50, 1, true);
  parameterize("num_rings", 20, 1, 20, 1, false);
  parameterize("starting_radius", canvas_x/2, 100, 1000, 1, true);

}

function setup() {
  common_setup();
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();

  translate(canvas_x/2, canvas_y/2);
  for(let i=0; i<num_rings; i++){
    rotate(random(360));
    let ring_radius = -starting_radius+i*petal_height/2;
    //petal density = 0.5
    let petals_per_ring = floor(abs(ring_radius)*0.5);
    for(let j=0; j<petals_per_ring; j++){
      push();
      rotate(360/petals_per_ring*j);
      translate(0, ring_radius);
      translate(random(petal_width), random(petal_height));
      petal();
      pop();
    }
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
function petal(){
  let num_petals = random(3,8);
  for(let i=0; i<num_petals; i++){
    push();
    let working_width = lerp(petal_width, 0, i/num_petals);
    let working_height = lerp(petal_height, 0, i/num_petals);
    translate(-working_width/2,0);

    beginShape();
    vertex(0,0);
    bezierVertex(0, 0, -working_width, -working_height, working_width/2, -working_height);
    bezierVertex(working_width/2, -working_height, working_width*1.5,-working_height, working_width, 0);
    endShape(CLOSE);

    pop();
  }
}