gif = false;
fr = 30;

noise_off = 20;
xoff = 0;
inc = 0.1*60/fr;

capture = false;
capture_time = 15;
function setup() {
  common_setup(gif, SVG);
  
  sym_angs = floor(random(6,49));
  line_segs = floor(random(20,51));

  stroke("BLACK");
}
//***************************************************
function draw() {
  capture_start(capture);

  //bleed
  bleed_border = apply_bleed();

  //actual drawing stuff
  push();
  for(let i=0; i<sym_angs; i++){
    push();
      translate(canvas_x/2, canvas_y/2);
      noFill();
      strokeWeight(1.5*global_scale);

      beginShape();
      for(let j=0; j<line_segs; j++){
        dampening = 50;
        x = floor(map(noise((j + xoff)/dampening), 0, 1, -canvas_x*.75, canvas_x*.75));
        y = floor(map(noise((j + xoff + noise_off)/dampening), 0,1, -canvas_y*.75, canvas_y*.75));
        if(j == 0){
          curveVertex(x, y);
        }
        curveVertex(x, y);
      }
      endShape();
    pop();
    center_rotate(360/sym_angs);
  }

  xoff+= inc;

  pop();
  //cutlines
  apply_cutlines(bleed_border);
  capture_frame(capture, num_frames);
}