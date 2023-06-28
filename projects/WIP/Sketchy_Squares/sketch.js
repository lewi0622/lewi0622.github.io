'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
suggested_palettes = [BEACHDAY, GAMEDAY, SOUTHWEST]

function gui_values(){
  parameterize("number_squares", random(10,100), 1, 100, 1, false);
  parameterize("number_smears", random(2,20), 1, 100, 1, false);
  parameterize("number_lines", random(1,20), 1, 100, 1, false);
}

function setup() {
  common_setup(gif);
}
//***************************************************
function draw() {
  capture_start(capture);
  blendMode(modes[blend_mode]);
  //bleed
  const bleed_border = apply_bleed();

  refresh_working_palette();

  //apply background
  let bg_c = random(working_palette);
  background(bg_c)
  reduce_array(working_palette, bg_c)

  //actual drawing stuff
  push();
  rectMode(CENTER);
  colorMode(HSB)
  for(let j=0; j<number_squares; j++){
    let square_size = random(10,200);
    let center_x = random(square_size, canvas_x-square_size);
    let center_y = random(square_size, canvas_y-square_size);
    let min_x = canvas_x;
    let max_x = 0; 
    let min_y = canvas_y;
    let max_y = 0;
    drawingContext.setLineDash([]);
    stroke("BLACK");
    strokeWeight(0.01*global_scale);
    let square_c = random(working_palette);
    square_c = RGBA_to_HSBA(...square_c);
    square_c[3] = 0.8;
    for(let i=0; i<number_smears; i++){
      //hueshift
      square_c[0] += 1
      fill(square_c);
      const wobble_amount = 0.5;
      const wobble_x = random(-wobble_amount, wobble_amount)*square_size;  
      const wobble_y = random(-wobble_amount, wobble_amount)*square_size;
      if(center_x + wobble_x < min_x) min_x = center_x + wobble_x;
      if(center_x + wobble_x > max_x) max_x = center_x + wobble_x;
      if(center_y + wobble_y < min_y) min_y = center_y + wobble_y;
      if(center_y + wobble_y > max_y) max_y = center_y + wobble_y;
      square(center_x + wobble_x, center_y + wobble_y, square_size);
    }
    //move from square center to edges
    min_x -= square_size/2;
    max_x += square_size/2;
    min_y -= square_size/2;
    max_y += square_size/2;

    for(let i=0; i<number_lines; i++){
      stroke("BLACK");
      strokeCap(SQUARE);
      strokeWeight(random(0.1, 1)*global_scale);
      drawingContext.setLineDash([random(1,10)*global_scale, random(1,10)*global_scale]);
      const wobble_amount = 0.05;
      let wobble_min_x = random(-wobble_amount, wobble_amount)*square_size;  
      let wobble_max_x = random(-wobble_amount, wobble_amount)*square_size;
      let wobble_min_y = random(-wobble_amount, wobble_amount)*square_size;  
      let wobble_max_y = random(-wobble_amount, wobble_amount)*square_size;
      line(min_x + wobble_min_x, min_y + wobble_min_y, min_x + wobble_min_x, max_y + wobble_max_y); //left
      wobble_min_x = random(-wobble_amount, wobble_amount)*square_size;  
      wobble_max_x = random(-wobble_amount, wobble_amount)*square_size;
      wobble_min_y = random(-wobble_amount, wobble_amount)*square_size;  
      wobble_max_y = random(-wobble_amount, wobble_amount)*square_size;
      line(min_x + wobble_min_x, min_y + wobble_min_y, max_x + wobble_max_x, min_y + wobble_min_y); //top
      wobble_min_x = random(-wobble_amount, wobble_amount)*square_size;  
      wobble_max_x = random(-wobble_amount, wobble_amount)*square_size;
      wobble_min_y = random(-wobble_amount, wobble_amount)*square_size;  
      wobble_max_y = random(-wobble_amount, wobble_amount)*square_size;
      line(max_x + wobble_max_x, min_y + wobble_min_y, max_x + wobble_max_x, max_y + wobble_max_y); //right
      wobble_min_x = random(-wobble_amount, wobble_amount)*square_size;  
      wobble_max_x = random(-wobble_amount, wobble_amount)*square_size;
      wobble_min_y = random(-wobble_amount, wobble_amount)*square_size;  
      wobble_max_y = random(-wobble_amount, wobble_amount)*square_size;
      line(min_x + wobble_min_x, max_y + wobble_max_y, max_x + wobble_max_x, max_y + wobble_max_y); //bottom
    }
  }
  //grain
  pop();
  push();
  noFill();
  stroke("#f3f0de");
  // stroke(random(working_palette));
  strokeWeight(global_scale*0.001);
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




