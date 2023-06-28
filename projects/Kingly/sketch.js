'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 15;
const sixteen_by_nine = false;
suggested_palettes = [SAGEANDCITRUS, COTTONCANDY, SUPPERWARE]

//project variables
let xoff = 0;
const inc = 1*60/fr;
let yoff = 0;
const y_inc =0.001*60/fr;
let bg_c, crown_c, hl_c, rot, upper_shape, lower_shape;


function gui_values(){
  parameterize("max_point_height", 800/3, 10, 400, 10, true);
  parameterize("num_points", random([10,15,20, 25]), 1, 50, 1, false);
  parameterize("flip",random([0,1]), 0, 1, 1, false);
  parameterize("point_width", 15, 1, 100, 1, true);
}

function setup() {
  common_setup();
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();
  strokeCap(random([PROJECT,ROUND]));

  //first time setup
  if(frameCount == 1){
    bg_c = random(working_palette);
    reduce_array(working_palette, bg_c);
    crown_c = random(working_palette);
    reduce_array(working_palette, crown_c);
    hl_c = random(working_palette);
    upper_shape = random(["circle", "square", "triangle"]);
    lower_shape = random(["circle", "square", "triangle"]);
  }
  center_rotate(flip*180);
  background(bg_c)

  //actual drawing stuff
  push();
  noStroke();
  fill(crown_c);
  const point_height = max_point_height*map(noise(xoff/100), 0,1, 0.5,1);
  const radius = point_width/2;
  translate((canvas_x-(num_points*point_width))/2, canvas_y-(canvas_y-max_point_height*1.1)/2);
  const upper_circle_coords = [];
  const lower_circle_coords = [];
  const phase_mult = noise(xoff/1000)*20;
  const upper_mult = noise(yoff)*5000;
  const lower_mult = noise(yoff+1000)*5000;
  //crown
  beginShape();
  for(let i=0; i<=num_points; i++){
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
    const up_i = upper_circle_coords[i];
    fill(crown_c);
    switch(upper_shape){
      case "circle":
        circle(up_i.x, up_i.y, radius);
        break;
      
      case "square":
        square(up_i.x-radius/2, up_i.y-radius/2, radius);
        break;
      
      case "triangle":
        triangle(
          up_i.x - radius/2, up_i.y + radius/2, 
          up_i.x, up_i.y - radius/2,
          up_i.x + radius/2, up_i.y + radius/2
          );
        break;
    }


    if(i<lower_circle_coords.length){
      const low_i = lower_circle_coords[i];
      fill(bg_c);
      switch(lower_shape){
        case "circle":
          circle(low_i.x, low_i.y, radius);
          break;
        
        case "square":
          square(low_i.x-radius/2, low_i.y-radius/2, radius);
          break;

        case "triangle":
          triangle(
            low_i.x - radius/2, low_i.y - radius/2, 
            low_i.x, low_i.y + radius/2,
            low_i.x + radius/2, low_i.y - radius/2
            );
          break;
      }
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
  
  global_draw_end();
}
//***************************************************
//custom funcs