'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 10;

suggested_palettes = []

let starting_circle_radius;
let z_off=0;
let z_inc;

function gui_values(){  
  parameterize("num_rings", round(random(3,20)), 1, 100, 1, false);
  parameterize("num_circles", round(random(3,25)), 1, 100, 1, false);
  parameterize("starting_ring_radius", 180, 1, 400, 10, true);
}

function setup() {
  common_setup();
  z_inc = random(0.001, 0.01);
  starting_circle_radius = random(30, map(num_rings*num_circles, 9,500, 130, 30));
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();

  //apply background
  background("BLACK");

  //actual drawing stuff
  push();
  noStroke();
  translate(canvas_x/2, canvas_y/2);
  const offset_color = 25 * sin(z_off*1000) * global_scale;  
  blendMode(ADD);
  for(let z=0; z<num_rings; z++){
    let circle_radius = lerp(starting_circle_radius, starting_circle_radius/4, z/num_rings);
    rotate(map(noise(z+z_off), 0,1, 0,360));
    for(let j=0; j<num_circles; j++){
      for(let i=0; i<3; i++){
        if(i % 3 == 0) fill("RED");
        else if(i % 3 == 1) fill("BLUE");
        else fill("GREEN");

        const theta = j * 360 / num_circles;
        
        const radius = lerp(starting_ring_radius-i*offset_color, starting_ring_radius/16, z/num_rings);
        const x = radius * cos(theta);
        const y = radius * sin(theta);

        const real_radius = lerp(circle_radius, 0, j/num_circles);

        circle(x, y, real_radius);
        circle(x, y, real_radius);
      }
    }
  }

  z_off += random(z_inc*2);

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
