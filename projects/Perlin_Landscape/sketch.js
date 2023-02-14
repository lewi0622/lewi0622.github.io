'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
suggested_palettes = []

function gui_values(){
  parameterize("step_number", 400, 10, 1000, 1, false);
  parameterize("noise_damp_x", 500, 1, 1000, 10, false);
  parameterize("noise_damp_y", 300, 1, 500, 10, false);
  parameterize("noise_damp_drift", 500, 1, 500, 1, false);
  parameterize("shape_number", 100, 1, 1000, 1, false);
}

function setup() {
  common_setup(gif);
}
//***************************************************
function draw() {
  capture_start(capture);
  //bleed
  const bleed_border = apply_bleed();

  refresh_working_palette();

  //apply background
  let bg_c = random(working_palette);
  background(bg_c)
  reduce_array(working_palette, bg_c)

  //actual drawing stuff
  push();

  //origin in lower left
  translate(-canvas_x/2, canvas_y);

  let primary_color = random(working_palette);
  reduce_array(working_palette, primary_color);
  let secondary_color = random(working_palette);
  reduce_array(working_palette, secondary_color);
  primary_color = color(primary_color);
  secondary_color = color(secondary_color);

  noFill();
  strokeWeight(3*global_scale);
  strokeJoin(ROUND)
  const step_size = canvas_x*2/step_number;

  const slope_down_point = step_number/2-(canvas_x/3)/step_size;
  const slope_up_point = step_number/2+(canvas_x/3)/step_size;
  // const slope_points = slope_up_point-slope_down_point;

  for(let j=0; j<shape_number; j++){
    push();
    //drive drift close to zero so that the center is open at the end
    const horizontal_drift = map(j, 0, shape_number, 400*global_scale, 10*global_scale);
    translate(map(noise(j/noise_damp_drift), 0,1, -horizontal_drift, horizontal_drift),0);
    stroke(lerpColor(primary_color,secondary_color, j/shape_number));

    beginShape();
    let y_min = canvas_y*0.25;
    let y_max = -canvas_y*1.25;
    for(let i=0; i<step_number; i++){
      //add feature for checking if just beyond canvas before beginging/ending
      //draw noise curve from -canvas_x/2 to canvas_x*1.5
      let depth_valley_factor = 0;;
      if(j>shape_number/2) depth_valley_factor = map(j, shape_number/2, shape_number, 0, 5*global_scale);

      if(i<step_number/2 && i>slope_down_point){
        // y_min += depth_valley_factor;
        y_max += depth_valley_factor;
      }
      else if(i>step_number/2 && i<slope_up_point){
        // y_min -= depth_valley_factor;
        y_max -= depth_valley_factor;
      }

      const y = map(noise(i*step_size/noise_damp_x, j/noise_damp_y), 0,1, y_min, y_max);
      vertex(i*step_size, y);
    }
    endShape();
    pop();
  }

  pop();
  //cutlines
  apply_cutlines(bleed_border);
  capture_frame(capture);
}
//***************************************************
//custom funcs




