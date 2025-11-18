'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 5;
const capture = false;
const capture_time = 50/fr;

const suggested_palettes = [];
function gui_values(){

}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();
  push();
  rectMode(CENTER);
  let c_index = inc_color();
  fill("WHITE");

  const weight = BICCRISTAL*global_scale;
  strokeWeight(weight);
  const constraint = base_x/4;
  for(let i=0; i<2; i++){
    push();
    c_index = inc_color(c_index);
    const x = ceil(random(canvas_x/8, canvas_x*7/8)/constraint)*constraint;
    const y = ceil(random(canvas_x/8, canvas_y*7/8)/constraint)*constraint;
    const w = ceil(random(canvas_x/8, canvas_x/2)/constraint)*constraint;
    const h = ceil(random(canvas_y/8, canvas_y/2)/constraint)*constraint;
    translate(x,y);
    if(random()>1) overlapped_rect(w,h, random(weight/2,weight*1.25));
    else overlapped_circle(canvas_x/2, random([weight, weight *1.5]));
    pop();  
  }

  // const starting_x = random(canvas_x/8, canvas_x/2);
  // const starting_y = random(canvas_y/8, canvas_y/2);
  // const rect_w = random(canvas_x/8, canvas_x/2);
  // const rect_h = random(canvas_y/8, canvas_y/2);  
  // push();
  // translate(starting_x, starting_y);
  // overlapped_rect(rect_w, rect_h, random(weight/2,weight*1.25));
  // pop();
  // c_index = inc_color(c_index);

  // push();
  // translate(canvas_x - starting_x, canvas_y - starting_y);
  // overlapped_rect(rect_w, rect_h, random(weight/2,weight*1.25));
  // pop();
  // c_index = inc_color(c_index);
  
  // push();
  // translate(canvas_x/2, canvas_y/2);
  // overlapped_circle(canvas_x/2, random(weight/2,weight*1.25));
  // pop();
  // c_index = inc_color(c_index);

  //ideas
  //randomly reversed overlaps, instead of 1,2,3... it's 10, 9, 8
  //inc/dec instead of resetting

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs
function inc_color(index=-1){
  index++;
  const c = color(index);
  c.setAlpha(50);
  stroke(c);
  // const myred = color("red");
  // myred.setAlpha(50);
  // stroke(myred);
  return index
}

function overlapped_circle(radius, radius_step){
  // let max_overlaps = floor(random(3,15));
  let max_overlaps = 20
  const overlap_step = 0.5;
  let num_overlaps = 1;

  while(radius > 0){
    console.log(floor(num_overlaps));
    for(let i=0; i<floor(num_overlaps); i++){
      circle(0,0,radius);
    }
    num_overlaps += overlap_step;
    if(num_overlaps>max_overlaps){
      num_overlaps = 1;
      // max_overlaps = floor(random(3, 15));
    }
    radius -= radius_step;
  }
}

// function check_overlaps(
//   let num_overlaps 
//   if(style = "dec") num_overlaps
// }




function overlapped_rect(w, h, step){
  // const overlap_style = random(["inc", "dec", "incdec"]);

  let max_overlaps = floor(random(3,15));
  let num_overlaps = 1;
  // if(overlap_style == "dec"){
  //   num_overlaps = max_overlaps;
  // }


  while(w>0 && h>0){
    for(let i=0; i<num_overlaps; i++){
      rect(0,0,w,h);
    }
    num_overlaps++;
    if(num_overlaps>max_overlaps){
      num_overlaps = 1;
      max_overlaps = floor(random(3, 15));
    }
    w -= step;
    h -= step;
  }
}