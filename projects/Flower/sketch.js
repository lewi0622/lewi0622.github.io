'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [BEACHDAY, SOUTHWEST]
let this_petal;

function gui_values(){
  parameterize("petal_size", random(35,45), 20, 50, 1, true);
  parameterize("petal_rings", floor(random(8,12)), 4, 20, 1, false);
  parameterize("no_stroke", random([0,1]), 0,1,1,false);
  // parameterize("stroke_color", ["BLACK"])
  parameterize("weight", 0.5, 0.1, 5, 0.1, true);
}

function setup() {
  common_setup();
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();

  //apply background
  let bg_c = random(working_palette)
  background(bg_c)
  reduce_array(working_palette, bg_c)

  //actual drawing stuff
  push();

  this_petal = petal_size;
  translate(canvas_x/2, canvas_y/2);
  if(no_stroke==0){
    noStroke();
  }
  else{  
    stroke('black');
    strokeWeight(weight);}
  let distance = canvas_y/random(3,5);
  for(let i=0; i<petal_rings; i++){
    rotate(random(0,360));
    const petal_c = random(working_palette);
    fill(petal_c);
      // Shadow
    drawingContext.shadowColor = color(petal_c);
    drawingContext.shadowBlur = 10*global_scale;

    //at 30 or higher, the last half petal applies tends to overwrite lines
    petalLayer(floor(random(12,26)), distance);

    this_petal *= random(0.6, 0.9);
    distance *= random(0.7, 0.8);
  }

  pop();
  
  global_draw_end();
}
//***************************************************
//custom funcs
function petal(start_y, close){
  push();
  translate(0, start_y);
  beginShape();
  curveVertex(0,0);
  curveVertex(0,0);
  curveVertex(this_petal/2, this_petal/2);
  curveVertex(0, this_petal);
  curveVertex(-this_petal/2, this_petal/2);
  if(close){
    endShape(CLOSE);
  }
  else{
    endShape()
  }
  pop();
}

function petalLayer(num_petal, distance){
  for(let i=0; i<=num_petal; i++){
    rotate(360/num_petal);
    petal(distance, i!=num_petal);
  }
}