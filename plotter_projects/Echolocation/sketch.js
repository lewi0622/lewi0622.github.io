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
  parameterize("iterations_per_circle", 2, 1, 5, 1, false);
  parameterize("number_of_rings", floor(random(10,100)), 1, 400, 1, false);
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

  for(let i=0; i<number_of_circles; i++){
    const stroke_c = random(colors);
    stroke(stroke_c);
    line_blur(stroke_c, 2*global_scale);
    
    const ending_radius = random(canvas_x/2, canvas_x*1.5);
    const end = createVector(
      canvas_x/2 + random(-1,1)*canvas_x/2,
      canvas_y/2 + random(-1,1)*canvas_y/2);

    for(let j=0; j<iterations_per_circle; j++){
      const starting_radius = random(0, ending_radius/4);
      const start = createVector(
        end.x + random(-1,1)*(ending_radius-starting_radius)/3,
        end.y + random(-1,1)*(ending_radius-starting_radius)/3);
      for(let k=0; k<number_of_rings; k++){
        let target = p5.Vector.lerp(start,end, k/number_of_rings);
        let radius = lerp(starting_radius, ending_radius, k/number_of_rings);
        circle(target.x, target.y, radius);
        if(type=="png") circle(target.x, target.y, radius);
      }
    }
  }
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
