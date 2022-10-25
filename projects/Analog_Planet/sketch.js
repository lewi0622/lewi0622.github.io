'use strict'
//setup variables
const gif = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
let suggested_palette;


function gui_values(){

}

function setup() {
  suggested_palette = random([BEACHDAY, SUMMERTIME, NURSERY]);
  common_setup(gif);
}
//***************************************************
function draw() {

  capture_start(capture);
  //bleed
  const bleed_border = apply_bleed();

  let working_palette = JSON.parse(JSON.stringify(palette));

  //apply background
  const bg_c = random(working_palette);  
  background(bg_c);
  reduce_array(working_palette, bg_c);

  //actual drawing stuff
  push();

  const weight = random(0.7, 1.5)*global_scale;

  strokeWeight(weight);
  strokeCap(SQUARE);

  const radius = floor(random(75,150))*global_scale;
  translate(canvas_x/2, canvas_y/2);

  const ang = floor(random(8))*45;
  rotate(ang);

  let c1 = random(working_palette);
  reduce_array(working_palette, c1);
  let c2 = random(working_palette);
  let c3 = random(working_palette);

  const blend_lines = random()>0.5;
  let  opacity = random(2,8);
  
  c1[3] = opacity;
  c2[3] = opacity;
  c3[3] = opacity;

  const steps = radius*100;
  blur = random([1, 2, 24]);
  let squish;
  if(blur == 24){
    squish = 0;
  }
  else{
    squish = random()*20*global_scale;
  }

  for(let i=-steps; i<steps; i++){
    push();
      const y = radius * (i/steps);
      translate(0, y);

      //circle
      const len = sqrt(sq(radius) - sq(y)) +squish;
      if(blend_lines){
        opacity = random(2,8);
        c1[3] = opacity;
        c2[3] = opacity;
        c3[3] = opacity;
      }
      let c;
      if(i<0){
        c = lerpColor(color(c2), color(c1), abs(i)/steps)
      }
      else{
        c = lerpColor(color(c1), color(c3), abs(i)/steps)
      }

      stroke(c);
      line(-len + random(-len, len)/blur,random(-len, len)/24, len + random(-len, len)/24,random(-len, len)/24);
    pop();
  }
  pop();
  //cutlines
  apply_cutlines(bleed_border);
  capture_frame(capture);
}
//***************************************************
//custom funcs