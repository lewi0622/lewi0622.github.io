'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];


function gui_values(){
  parameterize("cols", round(base_x/16), 1, round(base_x/2), 1, false);
  parameterize("px_blur", 20, 0, 50, 1, true);
  parameterize("thr", 0.3, 0.3, 0.8, 0.01, false);
} 

function setup() {
  common_setup();
  gui_values();

  noStroke();
  fill("WHITE");
  document.body.style.background = "BLACK";
  pixelDensity(2);
}
//***************************************************
function draw() {
  global_draw_start();
  push();

  background("BLACK")

  drawingContext.filter = 'blur(' + String(px_blur) + 'px)'

  const tile_size = canvas_x/cols;
  const rows = round(canvas_y/tile_size);
  translate(tile_size/2, tile_size/2);

  const [xoff, yoff] = noise_loop_2d(fr, capture_time, 10);
  const c = color("WHITE");
  fill(c);

  for(let i=0; i<cols; i++){
    push();
    for(let j=0; j<rows; j++){
      push();
      translate(i * tile_size, j * tile_size);

      const diameter = 1 * tile_size// * map(noise(i/100, j/100, frameCount/100), 0,1, 0.5, 1.5);
      if(pnoise.simplex3(i/10, j/10, xoff) > 0)
        circle(0,0,diameter);
      pop();
    }
    pop();
  }

  threshold_alpha(thr)

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs

function threshold_alpha(thr){
  loadPixels();
  for(let i=0; i<pixels.length; i+=4){
    const r = pixels[i];
    const g = pixels[i+1];
    const b = pixels[i+2];
    const gray = (r+g+b)/(255*3);
    if(gray < thr) pixels[i+3] = 0;
    else{
      pixels[i] = 255;
      pixels[i+1] = 255;
      pixels[i+2] = 255;
    }
  }

  updatePixels();
}