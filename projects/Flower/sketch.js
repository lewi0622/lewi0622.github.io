'use strict';
//setup variables
const gif = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
let suggested_palette;

//project variables
let petal_size; 

function setup() {
  suggested_palette = random([BEACHDAY, SOUTHWEST]);
  common_setup(gif);
}
//***************************************************
function draw() {
  capture_start(capture);

  //bleed
  const bleed_border = apply_bleed();

  let working_palette = JSON.parse(JSON.stringify(palette));

  //apply background
  let bg_c = random(working_palette)
  background(bg_c)
  reduce_array(working_palette, bg_c)

  //actual drawing stuff
  push();
  petal_size = random(35,45)*global_scale;

  translate(canvas_x/2, canvas_y/2);
  if(random([0,1])==0){
    noStroke();
  }
  else{  
    stroke('black');
    strokeWeight(0.5*global_scale);}
  let distance = canvas_y/random(3,5);
  for(let i=0; i<random(8,12); i++){
    rotate(random(0,360));
    const petal_c = random(working_palette);
    fill(petal_c);
      // Shadow
    drawingContext.shadowColor = color(petal_c);
    drawingContext.shadowBlur = 10*global_scale;

    //at 30 or higher, the last half petal applies tends to overwrite lines
    petalLayer(floor(random(12,26)), distance);

    petal_size *= random(0.6, 0.9);
    distance *= random(0.7, 0.8);
  }

  pop();
  //cleanup
  apply_cutlines(bleed_border);

  capture_frame(capture);
}
//***************************************************
//custom funcs
function petal(start_y, close){
  push();
  translate(0, start_y);
  beginShape();
  curveVertex(0,0);
  curveVertex(0,0);
  curveVertex(petal_size/2, petal_size/2);
  curveVertex(0, petal_size);
  curveVertex(-petal_size/2, petal_size/2);
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