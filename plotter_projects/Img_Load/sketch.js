'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];
let font;
let img;
let imgbuffer;
let target_height, target_width;
let syntax;
let weight;
function preload(){
  img = loadImage("PXL_20221210_165219121.MP.jpg");
}

function gui_values(){
  parameterize("step_size", 10, 1, 50, 1, false);
  parameterize("r_damp", 255, 1, 500, 1, false);
  parameterize("g_damp", 255, 1, 500, 1, false);
  parameterize("b_damp", 255, 1, 500, 1, false);
  parameterize("rect_size_mult", 1, 0.1, 10, 0.1, false);
  parameterize("color_index_mult", 1, 0, 10, 0.1, false);
  parameterize("grayscale_cutoff", 0.5, 0, 1, 0.01, false);
  parameterize("skip_cuttoff", 0.8, 0, 1, 0.01, false);
}

//could order color palette based on brightness?

function setup() {
  common_setup();
  gui_values();

  //IMAGE LOAD IN BUFFER
  if((img.width - width) > (img.height - height)){
    target_width = width;
    target_height = target_width / (img.width / img.height);
  } else{
    target_height = height;
    target_width = target_height / (img.height / img.width);
  }
  imgbuffer = createGraphics(width, height);
  imgbuffer.image(img, 0,0, target_width, target_height);
  imgbuffer.filter(GRAY);
  //to draw image to screen, use
  // image(imgbuffer,0,0);
  imgbuffer.loadPixels();
  //IMAGE LOAD IN BUFFER END

  //FONT LOAD
  const buffer = fetch('..\\..\\fonts\\Roboto-Black.ttf').then(res => res.arrayBuffer());
    buffer.then(data => {
      font = opentype.parse(data);
      draw();
    });
  //FONT LOAD END

  rectMode(CENTER);
  working_palette = controlled_shuffle(working_palette, true);
  syntax = shuffle(["<", ">", "/", "\\", "+", "-", "*", "&", "^", "%", "$", "#"]);
  noFill();

}
//***************************************************
function draw() {
  global_draw_start();
  if(font == undefined) return;

  push();
  weight = LEPEN * global_scale;
  strokeWeight(weight);

  png_bg(false, "WHITE");

  const offset_x = (width - target_width)/2;
  const offset_y = (height - target_height)/2;
  translate(offset_x, offset_y);

  translate(step_size * rect_size_mult / 2, step_size * rect_size_mult /2);
  

  for (let y = 0; y < height; y += step_size) {
    for (let x = 0; x < width; x += step_size) {      
      const index = (x + y * width) * 4;
      const r = imgbuffer.pixels[index];
      const g = imgbuffer.pixels[index + 1];
      const b = imgbuffer.pixels[index + 2];
      const alpha = imgbuffer.pixels[index+3];
      if(alpha == 0) continue;

      let grayscale = (0.299*r + 0.587*g + 0.114*b)/255;

      const n = map(pnoise.simplex3(r/r_damp,g/g_damp,b/b_damp), -1,1, 0,1);

      if(grayscale > skip_cuttoff) continue
      push();
      noise_map(x,y,map(n, 0, skip_cuttoff, 0, 1));
      if(grayscale < grayscale_cutoff) stamp(x,y, map(grayscale, 0, grayscale_cutoff, 0, 1));
      pop();
    }
  }

  //pixel array is 1d array of size = width * height * 4
  //pixels = [pixel0RED, pixel0GREEN, piexl0BLUE, pixel0,ALPAH, pixel1RED, ...]


  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
function noise_map(x,y,n,circ = random()>0.5){
  push();
  //equal breaks
  const index = floor(n * working_palette.length * color_index_mult);
  const c = working_palette[index % working_palette.length];
  stroke(c);
  let size = step_size * rect_size_mult - weight;
  while(size > 0){
    if(circ) circle(x,y,size);
    else rect(x, y, size, size);
    size -= weight;
  }
  pop();
}

function stamp(x,y, n){
  const char = syntax[floor(n * syntax.length)];
  stroke("BLACK");
  noFill();

  const ascii_x_offset_mult = -0.3;
  const ascii_y_offset_mult = 0.34;

  x += step_size * rect_size_mult * ascii_x_offset_mult;
  y += step_size * rect_size_mult * ascii_y_offset_mult;

  const letter_path = font.getPath(char, x,y, step_size * rect_size_mult);
  draw_open_type_js_path_p5_commands(letter_path);
}