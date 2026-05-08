'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

let z;
const zinc = 0.25;

function gui_values(){
  parameterize("cols", round(base_x/16), 4, round(base_x/2), 1, false);
} 

function setup() {
  common_setup();
  gui_values();
  z = 0;
  noStroke();
  fill("WHITE");
  document.body.style.background = "BLACK";
  pixelDensity(2);
}
//***************************************************
function draw() {
  global_draw_start();
  push();
  // background("YELLOW")
  const approx_size = canvas_x/cols;
  const tile_size = (canvas_x-approx_size*2)/cols;
  const rows = round((canvas_y-tile_size*2)/tile_size);
  translate(tile_size*2, tile_size*1.5);

  const [xoff, yoff] = noise_loop_2d(fr, capture_time, 1);
  const c1 = color("WHITE");
  const c2 = color("WHITE");
  c2.setAlpha(0);

  for(let i=0; i<cols; i++){
    push();
    for(let j=0; j<rows; j++){
      push();
      translate(i * tile_size, j * tile_size);

      const n = map(noise(i/1 + z, j/1), 0,1, 0,1);

      const c = lerpColor(c1,c2, n);

      fill(c);

      translate(0,-tile_size/3);

      rotate(map(n, 0,1, 0,90));

      translate(0, tile_size/2);

      line_blur(c,(1-n)*tile_size);

      const h = 0.8*tile_size;
      const w = map(n,0,1, 1, 0.5) * tile_size;

      const repeat = round(map(n, 0,1, 5,1));
      for(let k =0; k<repeat; k++){
        ellipse(0,0, w,h);
      }

      translate(0,-tile_size/3);
      stroke("BLACK");
      erase();
      circle(0,0, tile_size/12);
      noErase();
      pop();
    }
    pop();
  }

  z += random(zinc, zinc * 2);

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs

