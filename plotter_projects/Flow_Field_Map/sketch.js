'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 30;
const capture = false;
const capture_time = 10;

const suggested_palettes = [BIRDSOFPARADISE, SUMMERTIME];

function gui_values(){
  const division = random(2,4);
  parameterize("cols", floor(base_x/division), 1, base_x, 1, false);
  parameterize("rows", floor(base_y/division), 1, base_y, 1, false);
  parameterize("x_margin", -base_x/2, -base_x/2, base_x/2, 1, true);
  parameterize("y_margin", -base_y/2, -base_y/2, base_y/2, 1, true);
  parameterize("step_size", random(4,10), 1, 50, 1, true);
  parameterize("angle_snap", random(1,45), 0, 180, 1, false);
  const damp = random(100, 500);
  parameterize("x_damp", random(100, 500)*400/base_x, 1, 1000, 1, false);
  parameterize("y_damp", random(100, 500)*400/base_y, 1, 1000, 1, false);
  parameterize("num_colors", round(random(1, working_palette.length-1)), 1, working_palette.length-1, 1, false);
  parameterize("simplex", 1, 0, 1, 1, false);
  parameterize("range_start", random(0,0.9), 0, 1, 0.01, false);
  parameterize("range_end", range_start + 0.1, 0, 1, 0.01, false);
}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();

  push();

  center_rotate(random([0,90,180,270]));
  noFill();
  strokeWeight(1*global_scale);
  png_bg(true);
  const colors = [];
  for(let i=0; i<num_colors; i++){
    colors.push(color(working_palette[i]));
    colors[i].setAlpha(150);
  }
  const col_step = (canvas_x-x_margin*2)/cols;
  const row_step = (canvas_y-y_margin*2)/rows;
  translate(x_margin, y_margin);

  for(let k=0; k<cols; k++){
    for(let l=0; l<rows; l++){
      const starting_pt = {
        x:k*col_step + random(-1, 1) * col_step, 
        y:l*row_step + random(-1, 1) * row_step};

      //check for noise values
      let noise_val;
      if(simplex){
        noise_val = pnoise.simplex2(starting_pt.x/global_scale/x_damp, starting_pt.y/global_scale/y_damp);
        noise_val = map(noise_val, -1,1, 0,1);
      }
      else{
        noise_val = noise(starting_pt.x/global_scale/x_damp, starting_pt.y/global_scale/y_damp);
      }

      if(range_start < noise_val && noise_val < range_end) continue;

      let angle;
      if(simplex){
        angle = pnoise.simplex2(starting_pt.x/global_scale/x_damp, starting_pt.y/global_scale/y_damp) * 180;
      }
      else{
        angle = noise(starting_pt.x/global_scale/x_damp, starting_pt.y/global_scale/y_damp) * 360;
      }
      push();
      // stroke(random(colors));
      translate(starting_pt.x, starting_pt.y);
      rotate(Math.round(angle/angle_snap)*angle_snap);
      line(-step_size, 0, step_size, 0);
      pop();
    }
  }

  pop();
  
  global_draw_end();
}
//***************************************************
//custom funcs