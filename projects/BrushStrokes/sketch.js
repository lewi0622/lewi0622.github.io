gif = false;
fr = 1;

capture = false;
capture_time = 10
function setup() {
  suggested_palette = random([COTTONCANDY, NURSERY, SUPPERWARE]);
  common_setup(gif);
}
//***************************************************
function draw() {
  capture_start(capture);

  //bleed
  bleed_border = apply_bleed();

  working_palette = JSON.parse(JSON.stringify(palette));
  if(gif){
    //randomize noise seed
    noiseSeed(random(10000))
  }

  //actual drawing stuff
  push();

  noiseDetail(random(4));

  strokeWeight(1*global_scale);
  steps = random(200,300);
  pts = 275;
  noFill();
  center_rotate(random(360));

  for(let z=0; z<2; z++){
    push();
    translate(0, random(canvas_y*.25, canvas_y*.5));
    dir = random([-1,1])
    noise_start = random(100);
    lines = random(150, 200);
    c = random(working_palette);
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
  apply_cutlines();

  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs


