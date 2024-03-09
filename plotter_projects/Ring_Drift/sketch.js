'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [COTTONCANDY, SIXTIES, SUPPERWARE]


function gui_values(){
  parameterize("starting_radius", 96/8, 0, 200, 0.01, true);
  parameterize("radius_inc", 1.25, 0.1, 50, 0.1, true);
  parameterize("starting_line_segments", 300, 3, 400, 1, false);
  parameterize("number_of_rings", 200, 1, 200, 1, false);
  parameterize("starting_max_noise", 0.1, 0, 10, 0.1, false);
  parameterize("max_noise_inc", 0.03, 0, 1, 0.01, false);
  parameterize("x_offset", random(200), 0, 200, 1, false);
  parameterize("z_inc", 0, 0, 1, 0.01, false);
}

function setup() {
  common_setup();
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();
  //actual drawing stuff
  push();
  noFill();
  // strokeWeight(random(0.25,0.75)*global_scale);
  // strokeWeight(COPICMARKER*3/4)
  strokeWeight(0.019685*96);
  translate(canvas_x/4, canvas_y/2);
  //scale line segments depending on radius??
  let z=0;
  let radius = starting_radius;
  let max_noise = starting_max_noise;
  for(let j=0; j<number_of_rings; j++){
    push()
    translate(map(j, 0, number_of_rings, 0, canvas_x/2),0)
    let line_segments = floor(random(starting_line_segments*3/4, starting_line_segments));
    beginShape();
    for(let i=0; i<line_segments; i++){
      let theta = 360/line_segments*i;
      let xoff = map(cos(theta+x_offset),-1,1,0,max_noise);
      let yoff = map(sin(theta),-1,1,0,max_noise);
      let r = map(noise(xoff,yoff,z),0,1,radius,radius*2);
      let x = r * sin(theta);
      let y = r * cos(theta);
      vertex(x,y);
    }
    endShape(CLOSE);
    
    max_noise += max_noise_inc;
    z += random(-z_inc,z_inc);
    pop();
  }
  pop();

  global_draw_end();
}
//***************************************************
//custom funcs

