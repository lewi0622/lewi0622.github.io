'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 10;

let bg_c, weight, c_id, lines, sub_lines;
const suggested_palettes = [BEACHDAY, SOUTHWEST, SUPPERWARE];

//project variables
const noiseMax = 1;
let phase;
const phase_off = 20;
const phase_inc = 1.5;


function gui_values(){

}

function setup() {
  common_setup();

  phase = 0;

  //styling
  palette = controlled_shuffle(palette, true);
  bg_c = bg(true);
  weight = 2*global_scale;
  strokeWeight(weight);
  strokeCap(ROUND);
  noFill();
  c_id = 0;

  lines = floor(random(40, 100));
  sub_lines = ceil(random(2, palette.length));
}
//***************************************************
function draw() {
  global_draw_start();

  //reset loop variables
  const min_len = (sin(phase)*4+40)*global_scale;
  background(bg_c);


  //actual drawing stuff
  push();

  translate(canvas_x/2, canvas_y/2);
  stroke(palette[c_id])
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
      stroke(palette[c_id])

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