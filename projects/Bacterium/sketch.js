'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 10;

let bg_c, c_id;
const suggested_palettes = [BEACHDAY, SOUTHWEST, SUPPERWARE];

//project variables
const noiseMax = 1;
let phase;
const phase_off = 20;


function gui_values(){
  parameterize("phase_inc", random(1,5), 1, 20, 1, false, grid_slider_1);
  parameterize("lines", floor(random(10, 150)), 6, 200, 1, false, grid_slider_2);
  parameterize("sub_lines", ceil(random(2, palette.length-1)), 2, palette.length-1, 1, false, grid_slider_3);
  parameterize("weight", random(1, 5), 1, 20, 1, true, grid_slider_4);
}

function setup() {
  common_setup();
  gui_values();

  phase = 0;

  //styling
  working_palette = controlled_shuffle(working_palette, true);
  bg_c = random(working_palette);
  reduce_array(working_palette, bg_c);
  strokeCap(ROUND);
  noFill();
  c_id = 0;
}
//***************************************************
function draw() {
  global_draw_start();
  strokeWeight(weight);

  //reset loop variables
  const min_len = (sin(phase)*4+40)*global_scale;
  background(bg_c);


  //actual drawing stuff
  push();

  translate(canvas_x/2, canvas_y/2);
  stroke(working_palette[c_id])
  circle(0,0,min_len*2);

  for(let i=0; i<360; i+=360/lines){
    const xoff = map(cos(i+phase), -1,1, 0, noiseMax);
    const yoff = map(sin(i+phase+phase_off), -1,1, 0, noiseMax);
    const len = map(noise(xoff, yoff), 0,1, 100,250)*global_scale;

    //subline precalc
    let sub_len = (len-min_len)*0.15;
    let sub_min_len = min_len;
    const cos_i = cos(i);
    const sin_i = sin(i);
    for(let j=0; j<sub_lines; j++){
      stroke(working_palette[c_id])

      const start_x = sub_min_len*cos_i;
      const start_y = sub_min_len*sin_i;
  
      const x = (sub_len+sub_min_len)*cos_i;
      const y = (sub_len+sub_min_len)*sin_i;

      line(start_x, start_y, x,y);

      //loop cleanup
      sub_min_len += sub_len + weight*2;
      c_id++;
      sub_len = (len-sub_min_len)/sub_lines;
    }
    //loop cleanup
    c_id =0;
  }

  phase+=phase_inc

  pop();
  
  global_draw_end();
}
//***************************************************
//custom funcs