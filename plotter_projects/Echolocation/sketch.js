'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [SAGEANDCITRUS, BUMBLEBEE, BIRDSOFPARADISE, SOUTHWEST, SIXTIES];

function gui_values(){
  parameterize("number_of_circles", floor(random(2,6)), 1, 50, 1, false);
  parameterize("number_of_rings", floor(random(10,100)), 1, 400, 1, false);
  parameterize("starting_radius", random(0,smaller_base), 0, smaller_base, 1, true);
  parameterize("num_colors", round(random(1, working_palette.length-1)), 1, working_palette.length-1, 1, false);
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
  strokeWeight(0.5*global_scale);
  png_bg(true);
  const colors = [];
  for(let i=0; i<num_colors; i++){
    colors.push(color(working_palette[i]));
  }
  noFill();
  const points=[];
  for(let i=0; i<=number_of_circles; i++){
    const vec = createVector(
      canvas_x/2 + random(-1,1)*canvas_x/3,
      canvas_y/2 + random(-1,1)*canvas_y/3);
    points.push(vec);
  }

  // let radius = starting_radius;
  for(let j=0; j<points.length-1; j++){
    let start = points[j];
    let end = points[j+1];

    const stroke_c = random(colors);
    stroke(stroke_c);
    line_blur(stroke_c, 2*global_scale);

    for(let i=0; i<number_of_rings; i++){
      let target = p5.Vector.lerp(start,end, i/number_of_rings);
      let radius = starting_radius + 2*abs(dist(start.x, start.y, target.x, target.y)); 
      circle(target.x, target.y, radius);
      if(type=="png") circle(target.x, target.y, radius);
    }
  }
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
