'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];


function gui_values(){
  parameterize("num_rings", 100, 1, 1000, 1, false);
  parameterize("ring_steps", 360, 1, 720, 1, false);
}

function setup() {
  common_setup();
  gui_values();
  noFill();
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();

  translate(width/2, height/2);
  rotate(random(360));
  let weight = 1;
  let ang_step = 360/ring_steps;
  const radius_step = weight;
  let min_y = 0;
  let max_y = 0;
  for(let i=0; i<num_rings; i++){
    beginShape();
    for(let j=0; j<=ring_steps; j++){
      const theta = j * ang_step;
      let radius_mult = i * radius_step;
      const radius = map(noise(cos(theta)/3 + 1, sin(theta)/3 + 1, i/100), 0,1, 0.5, 3) * radius_mult;
      const x = radius * cos(theta);
      const y = radius * sin(theta);
      vertex(x,y);
      if(y > max_y) max_y = y;
      if(y < min_y) min_y = y;
    }
    endShape(CLOSE);
  }
  
  stroke("RED");
  const c = color("RED");
  c.setAlpha(100);
  fill(c);
  const y_1 = random(min_y, max_y);
  const y_2 = random(min_y, max_y);
  const y_3 = random(y_2, max_y);
  const y_4 = random(y_1, max_y);
  
  curveTightness(random(-3,2));
  beginShape();
  curveVertex(-width/2, y_1);
  curveVertex(width/2, y_2);
  curveVertex(width/2, y_3);
  curveVertex(-width/2, y_4);
  endShape(CLOSE);

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs

