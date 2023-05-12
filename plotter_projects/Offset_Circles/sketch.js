'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 8;

function gui_values(){
  parameterize("rows", 10, 1, 50, 1, false);
  parameterize("cols", 10, 1, 50, 1, false);
  parameterize("grid_size", 20, 1, 100, 1, true);
  parameterize("min_radius", 96/16, 1, 500, 1, true);
  parameterize("max_radius", 96/8, 1, 500, 1, true);
  parameterize("freq", 1, 0.1, 5, 0.1, false);
}

function setup() {
  common_setup(gif, SVG, 6*96, 6*96);
}
//***************************************************
function draw() {
  capture_start(capture);
  //bleed
  const bleed_border = apply_bleed();

  //actual drawing stuff
  push();
  
  let c1 = color(216, 126, 164, 100);
  let c2 = color(70, 174, 183, 100);
  let c3 = color("BLACK");
  let c4 = color("GOLD");
  let colors = [c1,c2]//,c3,c4];
  strokeWeight(2*global_scale);
  noFill();
  const x_noise_offset = random(-100,100);
  const y_noise_offset = random(-100,100);
  for(let z=0; z<colors.length; z++){
    push();

    translate(random(-min_radius,min_radius), random(-min_radius,min_radius));
    stroke(colors[z]);
    for(let i=0; i<cols; i++){
      for(let j=0; j<rows; j++){
        push();
        const x = map(noise(freq * i/cols + x_noise_offset, freq * j/rows + y_noise_offset), 0,1, -max_radius*4, max_radius*4) + i*grid_size;
        const y = j*grid_size; 
        translate(x,y);
        rotate(random(360));
        const h = random(min_radius,max_radius);
        const w = random(min_radius,max_radius);
        ellipse(0,0, h, w);
        ellipse(0,0, h/2, w/2);

        pop();
      }
    }
    pop();
  }

  //2d noise field with only slight variation
  
  //offset for each color
  
  //ellipse for wobble with rano rotation

  pop();

  //cleanup
  apply_cutlines(bleed_border);

  capture_frame(capture);
}
//***************************************************
//custom funcs


