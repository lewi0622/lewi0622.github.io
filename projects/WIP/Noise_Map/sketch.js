'use strict';
let font;
function preload() {  font = loadFont('..\\..\\fonts\\xband-ro.ttf');  }

//setup variables
const gif = false;
const fr = 30;
const capture = true;
const capture_time = 3;
const sixteen_by_nine = false;
let suggested_palette;

function setup() {
  suggested_palette = random([SAGEANDCITRUS, COTTONCANDY, SUPPERWARE]);
  common_setup(gif);
}
//***************************************************
function draw() {
  capture_start(capture);
  //bleed
  const bleed_border = apply_bleed();

  let working_palette = JSON.parse(JSON.stringify(palette));
  let primary_c = random(working_palette);
  reduce_array(working_palette, primary_c);
  let secondary_c = random(working_palette);
  strokeCap(random([PROJECT,ROUND]))
  primary_c = color(primary_c);
  secondary_c = color(secondary_c);
  //apply background
  // bg_c = random(working_palette)
  background(random(working_palette))
  // reduce_array(working_palette, bg_c)

  //actual drawing stuff
  push();
  // const primary_c = color(random(working_palette));
  // let primary_c;
  const line_len = 4*global_scale;
  const grid_size = 1*global_scale;
  const grid_x = canvas_x/grid_size;
  const grid_y = canvas_y/grid_size;
  const layers = 2;
  for(let z=0; z<layers; z++){
    for(let i=0; i<grid_x; i++){
      for(let j=0; j<grid_y; j++){
        let c;
        push();
        if(random()>0.9) c=secondary_c;
        else c=primary_c;
        c.setAlpha(60);
        stroke(c);
        translate(i*grid_size,j*grid_size);
        const x_damp = map(noise(i/100), 0,1, 100,1000);
        // const y_damp = map(noise(j/10000), 0,1, 10, 100);
        const y_damp = 100;
        strokeWeight(map(noise(i/x_damp,j/y_damp), 0,1, 0,1.5)*global_scale);
        if(random()>0.1){
          if(random()>0.5) line(0,0, 0,line_len)
          else line(0,0, line_len, 0)
        }
        pop();
      }
    }
  }

  
  primary_c = color("RED");
  primary_c.setAlpha(100);
  textFont(font);
  fill(primary_c);
  textSize(80*global_scale);
  textAlign(CENTER);
  let t_height = textAscent()
  push();
  translate(canvas_x/2, t_height);
  text("You", 0, 0);
  translate(0, t_height*1.5);
  text("wouldn't", 0, 100);
  translate(0, t_height*2);
  text("steal a car", 0, 200);
  pop();
  filter(POSTERIZE, 2)
  // filter(POSTERIZE, 3)
  pop();
  //cutlines
  apply_cutlines(bleed_border);
  capture_frame(capture);
}
//***************************************************
//custom funcs