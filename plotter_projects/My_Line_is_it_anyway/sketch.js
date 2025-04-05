'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [BEACHDAY, BUMBLEBEE, SUMMERTIME];

function gui_values(){
  parameterize("steps", random(200,300), 1, 1000, 1, false);
  parameterize("step_rad", larger_base/4, larger_base*0.05, larger_base*2, 1, true);
  parameterize("iterations", floor(random(3,6)), 1, 20, 1, false);
} 

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();
  const weight = SIGNOBROAD * global_scale;
  strokeWeight(weight);
  background("BLACK");

  //actual drawing stuff
  push();
  const angles = [random(360), random(360)];
  const scaled_base = max(larger_base * global_scale, sqrt(pow(smaller_base,2) + pow(larger_base,2))*global_scale);
  noFill();
  translate(canvas_x/2, canvas_y/2);

  const radii = [0];  
  let last_rad = 0;

  while(last_rad<scaled_base){
    const rad = last_rad + random(0.25,1) * step_rad;
    last_rad = rad;
    radii.push(rad);
  }

  stroke("WHITE")
  const step_size = scaled_base/steps;
  const start = -scaled_base/2;
  const noise_offset = 1000;
  for(let j=0; j<iterations; j++){
    push();
    rotate(angles[j%2])

    let x = start;
    let i = 0;
    let i_noise_offset = 0;
    let discontinuity = round(random(0.01, 0.1) * steps);
    let y_offset = 0;
    let offset_start = false;
    while(x<scaled_base/2){
      if(i%discontinuity==0){
        i_noise_offset += 100;
        // y_offset = random([-1,1]) * 0.1 * scaled_base;
        offset_start = random([false,true]);
        if(offset_start) y_offset = map(noise(i_noise_offset + i/50, j), 0,1, -scaled_base, scaled_base);
        else y_offset = map(noise(i_noise_offset + noise_offset + i/50, j), 0,1, -scaled_base, scaled_base);
        discontinuity += round(random(0.01, 0.1) * steps);
      }
      x += random(0.25,1.25) * step_size;
      let y_start = map(noise(i_noise_offset + i/50, j), 0,1, -scaled_base, scaled_base);
      let y_end = map(noise(i_noise_offset + noise_offset + i/50, j), 0,1, -scaled_base, scaled_base);

      const nearest_start_rad = find_nearest_biggest_radius(x, y_start, radii);
      y_start = Math.sign(y_start) * sqrt(pow(nearest_start_rad, 2) - pow(x, 2));

      const nearest_end_rad = find_nearest_biggest_radius(x, y_end, radii);
      y_end = Math.sign(y_end) * sqrt(pow(nearest_end_rad,2) - pow(x,2));

      if(offset_start) y_start = y_offset;
      else y_end = y_offset;

      if(dist(x, y_start, x, y_end)<1*global_scale) continue;
      line(x, y_start, x, y_end);

      // consider drawing radii evenly spaced over time and constraining the noise mapping to the largest radii and then occulting? would have to reduce number of steps too.
      i++;
    }
    pop();
  }

  for(let i=0; i<radii.length; i++){
    stroke("GOLD");
    if(radii[i] == 0) continue;
    const num_rings = 30;
    for(let j=0; j<num_rings; j++){
      circle(0,0,radii[i]*2 - j * weight/2 + num_rings/2*weight/2);
    }
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
function find_nearest_biggest_radius(x,y, radii){
  //finds the two closest radii, and returns the larger of the two
  const rad = sqrt(pow(x,2)+pow(y,2));
  let closest = radii[0];
  let second_closest = closest;

  for(let i=1; i<radii.length; i++){
    if(abs(radii[i] - rad) < abs(closest - rad)){
      second_closest = closest; 
      closest = radii[i];
    }
    else if(abs(radii[i] - rad) < abs(second_closest - rad)) second_closest = radii[i];
  }
  return max(closest, second_closest); 
}
