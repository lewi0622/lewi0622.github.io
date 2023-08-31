'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

suggested_palettes = [OASIS,SUPPERWARE,TOYBLOCKS]

function gui_values(){
  parameterize("num_circles", round(random(2,15)), 1, 50, 1, false);
  parameterize("buffer", 110, 0, 400, 1, true);
  parameterize("blur_size", 4, 0, 100, 1, true);
  parameterize("blur_offset_x", random(-5,5), -20, 20, 1, true);
  parameterize("blur_offset_y", random(-5,5), -20, 20, 1, true);
}

function setup() {
  common_setup();
  //if not square, the cirlces have weird protrusions
  strokeCap(SQUARE);
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();

  //apply background
  let bg_c = random(working_palette);
  background(bg_c)
  reduce_array(working_palette, bg_c)

  //actual drawing stuff
  push();
  for(let i=0; i<num_circles; i++){
    push();
    translate(random(buffer, canvas_x-buffer), random(buffer, canvas_y-buffer));
    let rad=round(random((1-i/num_circles)*100, 200-50*(1-i/num_circles)));
    rad *= global_scale;
    strokeWeight(random(5,15)*global_scale);

    const circ_c = random(working_palette);
    drawingContext.shadowColor = "black";
    drawingContext.shadowBlur = blur_size;
    drawingContext.shadowOffsetX = blur_offset_x;
    drawingContext.shadowOffsetY = blur_offset_y;
    stroke(circ_c);
    circle(0,0, rad);
    drawingContext.clip();
    //change shadow color to clear so no artifacting shows up on circle
    drawingContext.shadowColor = color(0,0,0,0);
    image(criss_cross(rad, circ_c),-rad/2,-rad/2);
    pop();
  }
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs

function criss_cross(rad, c){
  let pg = createGraphics(rad,rad);
  pg.translate(rad/2, rad/2);
  pg.rotate(random(360));
  pg.translate(-rad/2, -rad/2);
  pg.strokeWeight(random(2, 8)*global_scale);
  let grid_c = c;
  while(grid_c == c) grid_c = random(working_palette);
  grid_c = color(grid_c);
  grid_c.setAlpha(150);
  pg.stroke(grid_c);
  pg.background(c);
  let line_nums = ceil(rad/10);
  pg.noFill();
  for(let i=0; i<line_nums; i++){
    pg.push();
    pg.translate(i*10*global_scale, 0);
    pg.rect(0,0, 10*global_scale, rad);
    pg.pop();
  }
  grid_c.setAlpha(100);
  pg.stroke(grid_c);
  for(let i=0; i<line_nums; i++){
    pg.push();
    pg.translate(0, i*10*global_scale);
    pg.rect(0,0, rad, 10*global_scale);
    pg.pop();
  }

  return pg;
}