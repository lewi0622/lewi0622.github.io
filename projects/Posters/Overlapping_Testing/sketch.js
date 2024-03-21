'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 15;

const suggested_palettes = [BUMBLEBEE, GAMEDAY, SUPPERWARE];
let font;
function preload(){
  font = loadFont("../../../fonts/Porcine-Heavy.ttf");
}

function gui_values(){
  parameterize("starting_radius", 0, 0, 400, 1, true);
  parameterize("ending_radius", random(175,300), 0, 500, 1, true);
  parameterize("num_squares", floor(random(50,200)), 1, 200, 1, false);
  parameterize("rotation_damp", random(250, 1250), 1, 2000, 1, false);
}

function setup() {
  common_setup(400, 600);
  gui_values();
  canvas_y *= 3/4;
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  const c_1 = random(working_palette);
  background(c_1);
  rectMode(CENTER);
  noStroke();
  translate(canvas_x/2, canvas_y/2);
  for(let i=0; i<num_squares; i++){
    if(i%2==0){
      fill(c_1);
      blendMode(BLEND);
    }
    else{
      fill("WHITE");
      blendMode(EXCLUSION);
    }
    rotate(map(noise(i/rotation_damp), 0,1, -180, 180));
    const radius = lerp(ending_radius, starting_radius, i/num_squares);
    square(0,0,radius, random([0, radius/16]));
  }

  pop();

  push();
  //lower poster section
  translate(0,canvas_y);
  blendMode(EXCLUSION);
  fill("WHITE");
  textSize(50*global_scale);
  textFont(font);
  draw_face(50*global_scale);
  text("DALA " + seed_param, 10*global_scale, 140*global_scale);
  pop();

  // granulateWithSet(10);
  color_pixels([0,0,0,0], 0.9);

  global_draw_end();
}
//***************************************************
//custom funcs
function granulateWithSet(amount) {
  loadPixels();
  for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
          const pixel = get(x, y);
          const granulatedColor = color(
              pixel[0] + random(-amount, amount),
              pixel[1] + random(-amount, amount),
              pixel[2] + random(-amount, amount),
              // comment in, if you want to granulate the alpha value
              // pixel[3] + random(-amount, amount),
          );
          set(x, y, granulatedColor);
      }
  }
  updatePixels();
}

function color_pixels(c, chance) {
  loadPixels();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const pixel = get(x,y);
      let set_c = color(pixel[0], pixel[1], pixel[2], pixel[3]);
      if(random()>chance){
        set_c = color(
          pixel[0] = c[0],
          pixel[1] = c[1],
          pixel[2] = c[2],
          pixel[3] = c[3]
        );
      }
      else set (x,y, set_c);
    }
  }
  updatePixels();
}

function draw_face(size){
  //Draws LewistonFace centerd on current point
  textSize(size);

  const x_adjust = -70/200 * size;
  const y_adjust = -70/200 * size;

  push();
  translate(x_adjust, y_adjust);
  rotate(80);
  strokeWeight(1*global_scale);

  stroke("BLACK");
  text(":D", 0, 0)
  pop();
}