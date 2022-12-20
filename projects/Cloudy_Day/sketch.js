'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 5;
const capture = false;
const capture_time = 2;
const sixteen_by_nine = false;
suggested_palettes = [COTTONCANDY, NURSERY];
let cloud_color, cloud_back_color;
function gui_values(){
  parameterize("cloud_min_radius", random(0,5), 0, 200, 1, true);
  parameterize("cloud_max_radius", random(5,20), 0, 200, 1, true);
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
  //actual drawing stuff
  push();
  let multi_color = random()>0.75;
  let bg_c;
  if(multi_color)bg_c = "WHITE";
  else {
    bg_c = random(working_palette);
    reduce_array(working_palette, bg_c);
  }
  background(bg_c);
  cloud_color = bg_c;
  cloud_back_color = random([random(working_palette), "BLACK"]);

  translate(canvas_x/2, canvas_y/2);
  let num_clouds;
  let clump = random()>0.25;
  if(clump) num_clouds = round(random(1,10));
  else num_clouds = round(random(10,30));
  for(let i=0; i<num_clouds; i++){
    push();
    if(clump) translate(random(-canvas_x/8, canvas_x/8), random(-canvas_y/8,canvas_y/8));
    else translate(random(-canvas_x/4, canvas_x/4), random(-canvas_y/4,canvas_y/4));
    cloud(random(10,40)*global_scale, random(10,200)*global_scale, i*50, false, multi_color);
    pop();
  }

  //grain
  pop();
  push();
  noFill();
  stroke("#f3f0de");
  // stroke(random(working_palette));
  strokeWeight(global_scale*0.006);
  for(let i=0; i<60000; i++){
    circle(random(-canvas_x/2, canvas_x*1.5), random(-canvas_y/2, canvas_y*1.5), canvas_x/2);
  }

  pop();

  //cutlines
  apply_cutlines(bleed_border);
  capture_frame(capture);
}
//***************************************************
//custom funcs
function cloud(cloud_width, cloud_height, noise_offset, rain, random_background_color){

  if(rain) make_it_rain();

  noStroke();
  //build cloud from mid bottom
  const gaussian_mean = random(-1,1);
  const circle_data = [];
  let cloud_cirlces = map(cloud_width/global_scale*cloud_height/global_scale, 100, 8000, 1000, 20000)
  for(let i=0; i<cloud_cirlces; i++){
    let x = randomGaussian(gaussian_mean)*cloud_width;
    //shfit x by cloud width, as perlin noise is reflected about the 0 axis;
    const y_max = -abs(map(noise(x+cloud_width+noise_offset), 0,1, -cloud_height, cloud_height));
    let y = random(-y_max/8,y_max);
    let circle_rad = random(cloud_min_radius,cloud_max_radius);
    x += random(-circle_rad, circle_rad);
    circle_data.push([x,y,circle_rad]);
  }
  circle_data.forEach(data => {
    const x = data[0];
    const y = data[1];
    let rad = data[2];

    push();
    translate(x,y);
    // fill("BLACK");
    if(random_background_color) fill(random(working_palette));
    else fill(cloud_back_color);
    circle(0,0, rad);
    pop();
  });
  circle_data.forEach(data => {
    const x = data[0];
    const y = data[1];
    let rad = data[2];
    push();
    translate(x,y);
    fill(cloud_color);
    rad *= random(0.3,random(0.5,0.9));
    circle(0,0, rad);
    pop();
  });

}

function make_it_rain(starting_height, max_width){
  //todo
}