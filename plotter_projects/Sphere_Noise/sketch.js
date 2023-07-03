'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
suggested_palettes = [COTTONCANDY, SIXTIES, SUPPERWARE]


function gui_values(){
  parameterize("starting_radius", 96/8, 0, 200, 0.01, true);
  parameterize("radius_inc", 1.25, 0.1, 50, 0.1, true);
  parameterize("starting_line_segments", 300, 3, 400, 1, false);
  parameterize("number_of_rings", 200, 1, 200, 1, false);
  parameterize("starting_max_noise", 0.1, 0, 10, 0.1, false);
  parameterize("max_noise_inc", 0.03, 0, 1, 0.01, false);
  parameterize("x_offset", random(200), 0, 200, 1, false);
  parameterize("z_inc", random(0.05), 0, 1, 0.01, false);
}

function setup() {
  common_setup(gif, SVG, 6*96, 6*96);
}
//***************************************************
function draw() {
  capture_start(capture);
  //bleed
  const bleed_border = apply_bleed();

  refresh_working_palette();
  //actual drawing stuff
  push();
  noFill();

  strokeWeight(0.019685*96);
  translate(canvas_x/2, canvas_y/2);
  //scale line segments depending on radius??
  let z=0;
  let radius = starting_radius;
  let max_noise = starting_max_noise;
  let y_movement = 0;
  for(let j=0; j<number_of_rings; j++){
    let pts = [];
    let line_segments = floor(random(starting_line_segments*3/4, starting_line_segments));
    if(random()>0){
      for(let i=0; i<line_segments; i++){
        let theta = 360/line_segments*i;
        let xoff = map(cos(theta+x_offset),-1,1,0,max_noise);
        let yoff = map(sin(theta),-1,1,0,max_noise);
        let r = map(noise(xoff,yoff,z),0,1,radius,radius*2);
        let x = r * sin(theta);
        let y = r * cos(theta) + y_movement;
        if(random()>0) pts.push({x:x, y:y});
      }
    }

    //shuffle points to misalign seams
    pts = arrayRotate(pts, floor(random(pts.length)));

    beginShape();
    //if <length it doesn't close, <length+1 closes, <length+2 overlaps by one, start and end aren't same spot
    for(let i=0; i<pts.length+2; i++){
      const pt = pts[i%pts.length];
      vertex(pt.x, pt.y);
    }
    endShape();

    // inc the radius less and less as it moves outward
    if(j/number_of_rings<0.5){
      radius += map(j, 0, number_of_rings, radius_inc,0);
      max_noise += max_noise_inc;
    }
    else{
      radius -= map(j, 0, number_of_rings, 0, radius_inc);
      max_noise -= max_noise_inc;
    }
    // radius inc as sine
    // print(sin(j*8)*radius_inc)
    // radius += map(sin(j*32), -1,1, -radius_inc/4, radius_inc);

    // max_noise += max_noise_inc;
    z += random(z_inc);
  }

  pop();

  //cleanup
  apply_cutlines(bleed_border);

  capture_frame(capture);
}
//***************************************************
//custom funcs

