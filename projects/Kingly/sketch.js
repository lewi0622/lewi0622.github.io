'use strict';
//setup variables
const gif = true;
const fr = 30;
const capture = false;
const capture_time = 15;
const sixteen_by_nine = false;
let suggested_palette;

//project variables
let xoff = 0;
const inc = 1*60/fr;
let yoff = 0;
const y_inc =0.001*60/fr;
let bg_c, crown_c, hl_c, num_points, rot;

function setup() {
  suggested_palette = random([SAGEANDCITRUS, COTTONCANDY, SUPPERWARE]);
  common_setup(gif);
}
//***************************************************
function draw() {
  capture_start(capture);
  //bleed
  const bleed_border = apply_bleed();

  let working_palette = JSON.parse(JSON.stringify(palette));
  strokeCap(random([PROJECT,ROUND]))

  //first time setup
  if(frameCount == 1){
    bg_c = random(working_palette);
    reduce_array(working_palette, bg_c);
    crown_c = random(working_palette);
    reduce_array(working_palette, crown_c);
    hl_c = random(working_palette);
    num_points = random([10,15,20, 25]);
    rot = random([0, 180]);
  }
  center_rotate(rot);
  background(bg_c)

  //actual drawing stuff
  push();
  noStroke();
  fill(crown_c);
  const max_point_height = canvas_y * 2/3;
  const point_height = max_point_height*map(noise(xoff/100), 0,1, 0.5,1);
  const point_width = 15*global_scale;
  const radius = point_width/2;
  translate((canvas_x-(num_points*point_width))/2, canvas_y-(canvas_y-max_point_height*1.1)/2);
  const upper_circle_coords = []
  const lower_circle_coords = [];
  const phase_mult = noise(xoff/1000)*20;
  const upper_mult = noise(yoff)*5000;
  const lower_mult = noise(yoff+1000)*5000;
  //crown
  beginShape();
  for(let i=0; i<=num_points; i++){
    // const height_variation = map(noise(i/10+xoff), 0,1, -0.02, 0.5)*point_height;
    const height_variation = map(sin(i*phase_mult+upper_mult), -1,1, 0,1)*point_height;
    const lower_height_variation = map(cos(i*phase_mult+lower_mult), -1,1, -0.02,1)*point_height;
    //lower left tri vertex
    vertex(i*point_width, -lower_height_variation);

    if(i!=num_points){
      upper_circle_coords.push({x: i*point_width + point_width/2, y:-point_height+height_variation - radius/2});
      if(i != 0){
        lower_circle_coords.push({x: i*point_width, y:-lower_height_variation + radius/2});
      }

      //point vertex
      vertex(i*point_width + point_width/2, -point_height+height_variation);
    }
  }
  vertex(num_points*point_width, point_width);
  vertex(0, point_width);
  endShape();

  //circles
  for(let i=0; i<upper_circle_coords.length; i++){
    fill(crown_c);
    circle(upper_circle_coords[i].x, upper_circle_coords[i].y, radius)
    if(i<lower_circle_coords.length){
      fill(bg_c);
      circle(lower_circle_coords[i].x, lower_circle_coords[i].y, radius)
    }
  }

  noFill();

  //outline
  stroke(crown_c);
  strokeWeight(5*global_scale);
  rect(0,point_width, point_width*num_points, -max_point_height*1.1-point_width-radius);

  xoff += inc;
  yoff += y_inc;
  pop();
  //cutlines
  apply_cutlines(bleed_border);
  capture_frame(capture);
}
//***************************************************
//custom funcs