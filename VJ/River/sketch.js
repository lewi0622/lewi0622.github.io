'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 15;

const suggested_palettes = [];

let c;

function gui_values(){
  parameterize("num_pts", 100, 1, 200, 1, false);
  parameterize("river_width", 0, 0, base_y/2, 1, true);
  parameterize("pt_damp", 75, 1, 1000, 1, false);
  parameterize("bank_damp", 40, 1, 1000, 1, false);
  parameterize("amp", base_y, 0, base_y*2, 1, true);
}

function setup() {
  common_setup();
  gui_values();

  noStroke();
  c = random(working_palette);
  document.body.style.background = "BLACK";
  pixelDensity(2);
  background("BLACK");
  background(c);
}
//***************************************************
function draw() {
  global_draw_start(false);
  push();

  const bg_c = color("BLACK");
  bg_c.setAlpha(10);
  // background(bg_c);


  if(frameCount%5==0) c = random(working_palette);
  fill(c);

  const x_margin = canvas_x/2;
  const pt_step_size = (canvas_x + x_margin) / num_pts;
  translate(-x_margin/2, canvas_y/2-river_width/2);

  const [xoff, yoff] = noise_loop_2d(fr, capture_time, 3);
  beginShape();
  //out
  for(let j=0; j<num_pts; j++){
    const x = j * pt_step_size;
    const y = map(pnoise.simplex3(j/pt_damp, 1/bank_damp + xoff, yoff), -1,1, -amp, amp);
    curveVertex(x,y);
  }

  //back
  for(let j=0; j<num_pts; j++){
    const x = (num_pts - j) * pt_step_size;
    const y = map(pnoise.simplex3((num_pts - j)/pt_damp, 2/bank_damp + xoff, yoff), -1,1, -amp, amp);
    curveVertex(x,y+river_width);
  }

  endShape(CLOSE);

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs