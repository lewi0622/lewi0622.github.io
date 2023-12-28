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
  parameterize("max_petal_iterations", 8, 1, 20, 1, false);
}

function setup() {
  common_setup(10*96, 8*96);
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  //variation in petal bezier points
  //make it scale properly to the size of the canvas
  translate(canvas_x/2, canvas_y/2);
  let starting_radius = max(canvas_x, canvas_y) * 0.7;
  let petal_loc_vary = 0.5;
  let ring_radius = -starting_radius;
  let loop_count = 0;
  while(ring_radius < -petal_height/2){
    rotate(random(360));
    ring_radius = -starting_radius+loop_count*petal_height/2;
    let petal_density = 0.5
    let petals_per_ring = ceil(abs(ring_radius)*petal_density * 10/petal_width);
    petals_per_ring = constrain(petals_per_ring, 8, 10000);
    for(let j=0; j<petals_per_ring; j++){
      push();
      if(ring_radius/starting_radius < 0.2) petal_loc_vary = 0.2;

      rotate(360/petals_per_ring*j);
      translate(0, ring_radius);
      translate(random(-petal_loc_vary, petal_loc_vary)*petal_width, random(-petal_loc_vary, petal_loc_vary)*petal_width);
      petal();
      pop();
    }
    loop_count++;
  }

  circle(0,0, ring_radius*3);
  circle(0,0, 50);

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
function petal(){
  let num_petals = ceil(random(4,max_petal_iterations));
  for(let i=0; i<num_petals; i++){
    push();
    let working_width = lerp(petal_width, 0, i/num_petals) * random(0.9, 1.1);
    let working_height = lerp(petal_height, 0, i/num_petals) * random(0.9, 1.1);
    translate(-working_width/2,0);

    beginShape();
    vertex(0,0);
    const diff = 0.1;
    const midpoint = {
      x: working_width/2 * random(1-diff, 1+diff), 
      y: -working_height * random(1-diff, 1+diff)
    }
    bezierVertex(0, 0, -working_width, -working_height, midpoint.x, midpoint.y);
    bezierVertex(midpoint.x, midpoint.y, working_width*1.5,-working_height, working_width, 0);
    endShape(CLOSE);

    pop();
  }
}