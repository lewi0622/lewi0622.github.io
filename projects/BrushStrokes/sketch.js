'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
let suggested_palette;


function gui_values(){

}

function setup() {
  suggested_palette = random([COTTONCANDY, NURSERY, SUPPERWARE]);
  common_setup(gif);
}
//***************************************************
function draw() {
  capture_start(capture);

  //bleed
  const bleed_border = apply_bleed();

  refresh_working_palette();
  if(gif){
    //randomize noise seed
    noiseSeed(random(10000))
  }

  //actual drawing stuff
  push();

  noiseDetail(random(4));

  strokeWeight(1*global_scale);
  const steps = random(200,300);
  const pts = 275;
  noFill();
  center_rotate(random(360));

  for(let z=0; z<2; z++){
    push();
    translate(0, random(canvas_y*.25, canvas_y*.5));
    const dir = random([-1,1])
    const noise_start = random(100);
    const lines = random(150, 200);
    const c = random(working_palette);
    reduce_array(working_palette, c);
    stroke(c);
    for(let j=0; j<lines; j++){
      push();
      translate(0, random(canvas_y*.35));
      beginShape();
      for(let i=0; i<pts; i++){
        push();
        vertex(canvas_x/steps*i, noise(noise_start + i/75)*global_scale*100*dir);
        pop();
      }
      endShape();
      pop();
    }
    pop();
    center_rotate(random([0,90,180,270]));

  }

  pop();
  erase();
  noFill();
  cutoutCircle(canvas_y/64);
  noErase();

  //cleanup
  apply_cutlines(bleed_border);

  capture_frame(capture);
}
//***************************************************
//custom funcs


