'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 10;

const suggested_palettes = []

let starting_circle_radius;

function gui_values(){  
  parameterize("num_rings", round(random(3,20)), 1, 100, 1, false);
  parameterize("num_circles", round(random(3,25)), 1, 100, 1, false);
  parameterize("starting_ring_radius", 180, 1, 400, 10, true);
  parameterize("offset_amt", base_x/40, 0, base_x/2, 1, true);
  parameterize("pulse_per_cap", 5, 1, 20, 1, false);
  parameterize("speed", 0.5, 0, 2, 0.01, false);
}

function setup() {
  common_setup();
  gui_values();
  document.body.style.background = "BLACK";
  starting_circle_radius = random(base_x/20, base_x/10);//random(1, map(num_rings*num_circles, 9,500, 130, 30));
}
//***************************************************
function draw() {
  global_draw_start();
  //actual drawing stuff
  push();
  noStroke();
  translate(canvas_x/2, canvas_y/2);
  const ang = angle_loop(fr, capture_time, pulse_per_cap);
  const offset_color = offset_amt * sin(ang);  
  blendMode(ADD);

  const [xoff, yoff] = noise_loop_2d(fr, capture_time, speed);

  for(let z=0; z<num_rings; z++){
    let circle_radius = lerp(starting_circle_radius, starting_circle_radius/4, z/num_rings);
    rotate(map(pnoise.simplex2(xoff, yoff), -1,1, 0,360));
    for(let j=0; j<num_circles; j++){
      const theta = j * 360 / num_circles;
      for(let i=0; i<3; i++){
        fill("GREEN");
        if(i % 3 == 0) fill("RED");
        else if(i % 3 == 1) fill("BLUE");
        
        const radius = map(z/num_rings, 0, 1,
          starting_ring_radius-i*offset_color, 
          0);

        const x = radius * cos(theta);
        const y = radius * sin(theta);

        const real_radius = lerp(circle_radius, 0, j/num_circles);

        circle(x, y, real_radius);
        circle(x, y, real_radius);
      }
    }
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
