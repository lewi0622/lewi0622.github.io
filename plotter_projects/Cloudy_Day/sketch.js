'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 20;

const suggested_palettes = [NURSERY, TOYBLOCKS];
let cloud_color, cloud_back_color;
let rain_dir; 
function gui_values(){
  parameterize("cloud_min_radius", random(1,5), 0, 200, 1, true);
  parameterize("cloud_max_radius", random(3,10), 0, 200, 1, true);
  parameterize("num_clouds", floor(random(1,3)), 1, 5, 1, false);
  parameterize("rain", random([0,1]), 0, 1, 1, false);
  parameterize("rain_spacing", floor(random(5,20)), 1, 30, 0.5, true);
  parameterize("cloud_min_width", 10, 1, 100, 1, true);
  parameterize("cloud_max_width", 60, 1, 200, 1, true);
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
  cloud_color = "WHITE";
  cloud_back_color = "BLACK";

  translate(0,-canvas_y/8);

  let circle_rad = random(cloud_min_radius,cloud_max_radius);
  rain_dir = random([-1,1]);
  let cloud_info = [];
  for(let i=0; i<num_clouds; i++){
    let cloud_width = random(cloud_min_width,cloud_max_width);
    let cloud_height = random(cloud_width*1.5, cloud_width*6);
    let starting_x = canvas_x/2 +random(-cloud_width, cloud_width);
    let starting_y = canvas_y/2 + random(-cloud_height, cloud_height);
    let coords = (create_cloud_coords(cloud_width, cloud_height, i*50, false, circle_rad));
    coords.push([starting_x, starting_y]);
    cloud_info.push(coords);
  }
  cloud_info.forEach(e => {
    push();
    let x_upper_limit = e[1];
    translate(e[2][0], e[2][1]);
    if(rain) make_it_rain(x_upper_limit, rain_dir);
    pop();
  });
  cloud_info.forEach(e => {
    push();
    let coords = e[0];
    translate(e[2][0], e[2][1]);
    draw_clouds(coords);
    pop();
  });

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs
function create_cloud_coords(cloud_width, cloud_height, noise_offset, rain, circle_rad){

  //build cloud from mid bottom
  const gaussian_mean = random(-1,1);
  const gaussian_std = random(0.75,1.5);
  const x_upper_limit = cloud_width*3*gaussian_std;
  const circle_data = [];
  let cloud_cirlces = map((cloud_width/global_scale)/(circle_rad/global_scale), 0.5, 7, 200, 20000);
  for(let i=0; i<cloud_cirlces; i++){
    let x = randomGaussian(gaussian_mean,gaussian_std)*cloud_width;
    //ignore point if too far left/right
    if(abs(x)>x_upper_limit) continue;

    //shfit x by cloud width, as perlin noise is reflected about the 0 axis;
    const y_max = abs(map(noise((x+cloud_width+noise_offset)), 0,1, -cloud_height, cloud_height));
    let y = random(-y_max,y_max/8);

    const x_width_pct = abs(x)/x_upper_limit;
    let y_upper_limit = cloud_height*0.5*(1-x_width_pct);
    if(x_width_pct<0.5 && x_width_pct>0.2) y_upper_limit *= random(0.75, 0.8);
    else if(x_width_pct<0.5) y_upper_limit *= random(0.5, 0.75);
    constrain(y_upper_limit, 0, cloud_height * 0.5);
    if(abs(y)>y_upper_limit) continue;

    x += random(-circle_rad, circle_rad);
    circle_data.push([x,y,circle_rad]);
  }
  return [circle_data, x_upper_limit]
}

function draw_clouds(coords){
  coords.forEach(data => {
    const x = data[0];
    const y = data[1];
    let rad = data[2];

    push();
    translate(x,y);
    stroke(cloud_back_color);
    const x_wiggle = random(-1,1)*(rad)/2;
    const y_wiggle = random(-1,1)*(rad)/2;
    circle(x_wiggle, y_wiggle, rad);
    data[0] += x_wiggle;
    data[1] += y_wiggle;
    pop();
  });
  coords.forEach(data => {
    const x = data[0];
    const y = data[1];
    let rad = data[2];
    push();
    translate(x,y);
    stroke(cloud_color);
    rad *= random(0.2, 0.5);
    const x_wiggle = random(-1,1)*(data[2]-rad)/8;
    const y_wiggle = random(-1,1)*(data[2]-rad)/8;
    circle(x_wiggle, y_wiggle, rad);
    pop();
  });
}

function make_it_rain(max_width, dir){
  push();
  stroke(cloud_back_color);
  max_width *= 0.6;
  let number_rain = max_width*2/rain_spacing;
  let rain_length = random(canvas_y/4, canvas_y/2);
  let rain_direction = dir * tan(30)*rain_length;
  translate(-max_width,0);
  for(let i=0; i<number_rain; i++){
    push();
    translate(i*rain_spacing,0);
    line(0,0, rain_direction, rain_length);
    pop();
  }
  pop();
}