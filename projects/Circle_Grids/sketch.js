'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
suggested_palettes = [SAGEANDCITRUS, COTTONCANDY, SUPPERWARE]

function gui_values(){

}

function setup() {
  common_setup(gif);
}
//***************************************************
function draw() {
  capture_start(capture);
  //bleed
  const bleed_border = apply_bleed();

  refresh_working_palette();

  //apply background
  let bg_c = random(working_palette);
  background(bg_c)
  reduce_array(working_palette, bg_c)

  //actual drawing stuff
  push();
  center_rotate(360)
  let num_circles=round(random(1,10));
  for(let i=0; i<num_circles; i++){
    push();
    translate(random(110*global_scale,290*global_scale), random(110*global_scale,290*global_scale));
    let rad=round(random((1-i/num_circles)*100, 200-50*(1-i/num_circles)));
    rad *= global_scale;
    strokeWeight(random(5,15)*global_scale);
    const circ_c = random(working_palette);
    fill("BLACK");
    circle(random(5,20)*global_scale, random(5,20)*global_scale, rad);
    stroke(circ_c);
    circle(0,0, rad);
    drawingContext.clip();
    image(criss_cross(rad, circ_c),-rad/2,-rad/2);
    pop();
  }
  pop();
  //cutlines
  apply_cutlines(bleed_border);
  capture_frame(capture);
}
//***************************************************
//custom funcs

function criss_cross(rad, c){
  let pg = createGraphics(rad,rad);
  pg.translate(rad/2, rad/2);
  pg.rotate(random(360));
  pg.translate(-rad/2, -rad/2);
  pg.strokeWeight(random(0.1, 10)*global_scale);
  let grid_c = c;
  while(grid_c == c) grid_c = random(working_palette);
  pg.stroke(grid_c);
  pg.background(c);
  let line_nums = ceil(rad/10);
  for(let i=0; i<line_nums; i++){
    for(let j=0; j<line_nums; j++){
      pg.push();
      pg.noFill();
      pg.translate(i*10*global_scale, j*10*global_scale);
      pg.rect(0,0, 100*global_scale, 10*global_scale);
      pg.pop();
    }
  }
  return pg;
}