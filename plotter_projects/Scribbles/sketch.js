'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
suggested_palettes = [BIRDSOFPARADISE, MUTEDEARTH, OASIS]

function gui_values(){
  parameterize("tile_div", 150, 1, 400, 1, false);
  parameterize("num_lines", 20, 1, 50, 1, false);
  parameterize("amp_start", 30, 10, 50, 0.1, true);
  parameterize("tightness", 5, -5, 5, 0.1, false);
}

function setup() {
  common_setup(gif, SVG, 816, 1056);
}
//***************************************************
function draw() {
  capture_start(capture);

  //bleed
  const bleed_border = apply_bleed();

  refresh_working_palette();

  //apply background
  let bg_c = random(working_palette)
  background(bg_c)
  reduce_array(working_palette, bg_c)

  //actual drawing stuff
  push();
  noFill();

  const tile_x = canvas_x/tile_div;

  strokeWeight(MICRON05);
  const margin_x = 96;
  const margin_y = 96;
  stroke(random(working_palette));
  translate(margin_x, margin_y);
  for(let j=0; j<num_lines; j++){
    push();
    let distance_to_margin = canvas_x-margin_x*2;
    while(distance_to_margin>tile_x*20){
      print(distance_to_margin);
      const word_len = random(5, 20);
      if(j ==0) translate(tile_x, -amp_start);
      if(j == num_lines-1) translate(canvas_x-margin_x*2-word_len*tile_x,amp_start);
      beginShape();
      curveTightness(tightness);
      curveVertex(-10*global_scale,0);
      curveVertex(-10*global_scale,0);
      for(let i = 0;  i<word_len; i++){
        const l_r = random([-1,1,1])*tile_x*3;
        const u_d = random([-1,1])*amp_start;
        curveVertex(i*tile_x+noise(i+j)*l_r, noise(i+j)*u_d);
      }

      endShape();
      translate(tile_x*word_len+tile_x*2, 0);
      if(j==0 || j == num_lines-1) distance_to_margin = 0;
      else distance_to_margin -= tile_x*word_len;
    }
    pop();
    translate(0, amp_start*2);
  }
  pop();
  //cutlines
  apply_cutlines(bleed_border);

  capture_frame(capture);
}
//***************************************************
//custom funcs
