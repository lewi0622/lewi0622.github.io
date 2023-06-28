'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
suggested_palettes = [SAGEANDCITRUS, SUPPERWARE];

function gui_values(){
  parameterize("step_number", 200, 10, 1000, 1, false);
  parameterize("y_slide", 1.2, 0, 5, 0.1, true);
  parameterize("noise_damp_y", random(100,500), 1, 500, 10, false);
  parameterize("noise_damp_drift", 250, 1, 500, 1, false);
  parameterize("shape_number", 500, 1, 1000, 1, false);
}

function setup() {
  common_setup(400, 225);
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();

  //apply background
  let bg_c = random(working_palette);
  background(bg_c);
  reduce_array(working_palette, bg_c);

  //actual drawing stuff
  push();
  let clouds = random()>0.5;
  const star_size = 0.3*global_scale;
  //if bg_c is dark enough
  if(RGBA_to_HSBA(...bg_c)[2]<40){
    for(let i=0; i<1000; i++){
      push();
        noStroke();
        rectMode(CENTER);
        drawingContext.shadowColor = color("WHITE");
        drawingContext.shadowBlur = star_size*5;
        translate(random(canvas_x), random(canvas_y));
        square(0,0, star_size);
        rotate(45);
        square(0,0, star_size);
      pop();
    }
  }
  else if(clouds){
    push();
    background("WHITE")
    let cloud_c = bg_c;
    cloud_c = color(cloud_c);
    cloud_c.setAlpha(3);
    noStroke();
    fill(cloud_c);
    for(let i=0; i<1000; i++){
      circle(random(-canvas_x/2, canvas_x*1.5), random(-canvas_y/2, canvas_y*1.5), 200*global_scale);
    }
  }

  let primary_color = random(working_palette);
  reduce_array(working_palette, primary_color);
  let secondary_color;
  if(random()>0.5 || palette.length >= 3) secondary_color = primary_color;
  else secondary_color = random(working_palette);
  reduce_array(working_palette, secondary_color);
  bg_c = color(bg_c);
  primary_color = color(primary_color);
  secondary_color = color(secondary_color);

  noFill();
  strokeWeight(50*global_scale);
  strokeJoin(ROUND)
  const step_size = canvas_x*2/step_number;

  //find a minimum value to try and center on screen
  let max_noise = 0;
  let max_noise_x_index = 0;
  let max_noise_y_index = 0;
  for(let i=0; i<100; i++){
    for(let j=0; j<100; j++){
      if(noise(i,j)>max_noise){
        max_noise=noise(i,j);
        max_noise_x_index = i;
        max_noise_y_index = j;
      }
    }
  }

  const noise_range = random(0.25,3) * canvas_x/(400*global_scale);
  let lerp_start = random([0, 0.1]);
  for(let j=0; j<shape_number; j++){
    push();

    //get color lerped using RGB
    let c;
    colorMode(RGB);
    if(j/shape_number<0.5) c = lerpColor(bg_c, primary_color, constrain(map(j/shape_number, 0,0.5, 0,1), lerp_start, 1));
    else c = lerpColor(primary_color,secondary_color, map(j/shape_number, 0.5,1, 0,1));
    
    //convert to HSB
    colorMode(HSB);
    c = RGBA_to_HSBA(...c.levels);

    //vary brightness
    let brightness_reduction = map(j/shape_number, 0, 1, 0, 360*10);
    brightness_reduction = map(sin(brightness_reduction), -1, 1, -4, 4);
    c[2] -= brightness_reduction;
    //set color
    stroke(c);
    drawingContext.filter = 'blur('+map(j/shape_number, 0,1, 0.5,0)*global_scale+'px)';

    let drift_offset = map(noise(j/noise_damp_drift), 0,1, -noise_range,noise_range);
    //drift less over time
    if(j/shape_number>0.5) drift_offset = map(j/shape_number, 0.5,1, drift_offset,0);
    const noise_range_min = max_noise_x_index + drift_offset - noise_range/2;
    const noise_range_max = max_noise_x_index + drift_offset + noise_range/2;
    beginShape();
    for(let i=0; i<step_number; i++){
      let y_min = map(j, 0, shape_number, 0, -canvas_y) + j*y_slide;
      let y_max = canvas_y + j*y_slide;
      const noise_index = map(i, 0,step_number, noise_range_min, noise_range_max);
      const x = map(i, 0,step_number, -step_size, canvas_x+step_size);

      const y = map(noise(noise_index,j/noise_damp_y), 0,1, y_min, y_max);
      vertex(x,y);
    }
    endShape();

    pop();
  }

  pop();
  
  global_draw_end();
}
//***************************************************
//custom funcs




