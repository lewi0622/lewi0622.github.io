'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 20;

const suggested_palettes = [BEACHDAY, SUMMERTIME, SOUTHWEST, NURSERY, SIXTIES, SUPPERWARE]

let z = 0;
let z_inc = 0.05*30/fr;
let offset = 0;
let offset_inc = 0.03*30/fr;
let bg_c;
let mt_colors;
function gui_values(){
  parameterize("i_damp", 10, 1, 200, 1, false, grid_slider_1);
  parameterize("amp", 400, 0, 800, 1, true, grid_slider_2);
  parameterize("mts", random([20, 22, 24, 26, 28]), 1, 50, 1, false, grid_slider_3);
  parameterize("num_segments", round(random(10, 100)), 3, 400, 1, false, grid_slider_4);
}

function setup() {
  common_setup(800, 400);
  mt_colors = [];
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();

  //apply background
  if(frameCount == 1) bg_c = random(working_palette);
  background(bg_c)

  //actual drawing stuff
  push();
  strokeWeight(0.5*global_scale);
  translate(-canvas_x/2,canvas_y*3/4);
  for(let j=0; j<mts; j++){
    blendMode(BLEND);
    translate(0,j*global_scale);
    let c;
    if(j%2==0){
      c = color(random(working_palette));
      c.setAlpha(200);
      blendMode(MULTIPLY);
    }
    else{
      c = random(working_palette);
    }
    if(mt_colors.length < j+1) mt_colors.push(c);
    else c = mt_colors[j];
    fill(c);
    beginShape();
    vertex(0,0);
    vertex(0,0);
    for(let i=0; i<num_segments; i++){
      let x = i*canvas_x*2/num_segments;
      let y = map(noise(offset + i/i_damp, j/10, z), 0, 1, 0,-amp);
      curveVertex(x,y);
    }
    vertex(canvas_x*2,0);
    vertex(canvas_x*2,canvas_y);
    vertex(0, canvas_y);
    endShape();
  }

  z+=random(z_inc);
  offset += offset_inc;
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs




