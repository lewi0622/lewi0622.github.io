'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [SUPPERWARE];


function gui_values(){
  parameterize("cols", random(30,150), 1, 200, 1, false);
  parameterize("margin_x", -base_x/16, -base_x, base_x, 1, true);
  parameterize("margin_y", -base_y/16, -base_y, base_y, 1, true);
}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();
  pixelDensity(15)
  push();
  // center_rotate(random([0,90,180,270]));
  png_bg(true);

  const x_step = (canvas_x - margin_x * 2)/cols;
  const rows = round((canvas_y - margin_y * 2)/x_step);
  const y_step = x_step;
  noStroke();
  fill(random(working_palette));
  translate(margin_x, margin_y);

  const circ_index = [floor(random(cols)), floor(random(rows))];
  const round_ang = 30;
  const fwd_slash_angle = round(random(360)/round_ang)*round_ang;
  const fwd_c = random(working_palette);
  const bwd_slash_angle = round(random(360)/round_ang)*round_ang;
  const bwd_c = random(working_palette);
  const x_angle = round(random(360)/round_ang)*round_ang;
  const x_c = random(working_palette);

  const x_damp = random([3,10,25,50]);
  const y_damp = random([3,10,25,50]);

  for(let i=0; i<cols; i++){
    for(let j=0; j<rows; j++){
      push();
      if(cols<100 && circ_index[0] == i && circ_index[1] == j){
        blendMode(MULTIPLY);
        // circle(random(canvas_x)-margin_x, random(canvas_y)-margin_y, random(base_x/2, base_x*2)*global_scale);
      }
      translate(i * x_step, j * y_step);
      if((i+j)%2==0)blendMode(MULTIPLY);
      strokeWeight(random(1, 10)*global_scale);
      const num = noise(i/x_damp,j/y_damp);
      if(num < 0.33){//forward slash
        stroke(fwd_c);
        rot_in_grid(x_step, y_step, fwd_slash_angle);
        line(x_step/4, y_step*3/4, x_step*3/4, y_step/4);
      }
      else if(num >= 0.33 && num < 0.66){//backwards slash
        stroke(bwd_c)
        rot_in_grid(x_step, y_step, bwd_slash_angle);
        line(x_step/4, y_step/4, x_step*3/4, y_step*3/4);
      }
      else if(num >= 0.66){
        stroke(x_c);
        rot_in_grid(x_step, y_step, x_angle);
        line(x_step/4, y_step*3/4, x_step*3/4, y_step/4);
        line(x_step/4, y_step/4, x_step*3/4, y_step*3/4);
      }
      pop();
    }
  }
  pop();
  global_draw_end();
}
//***************************************************
//custom 
function rot_in_grid(x_step, y_step, ang){
  translate(x_step/2, y_step/2);
  rotate(ang);
  translate(-x_step/2, -y_step/2);
}