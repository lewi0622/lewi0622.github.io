gif = true;
fr = 30;

noise_off = 20;
xoff = 0;
inc = 0.1*60/fr;

capture = false;
capture_time = 5
function setup() {
  common_setup(gif, SVG);

  //apply background
  sym_angs = random([4,6,8,10,12,14,16]);
  line_segs = floor(random(5,20));
}
//***************************************************
function draw() {
  clear();
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
      curveTightness(map(noise(xoff/100), 0, 1, -5, 5));
      beginShape();
      for(let j=0; j<line_segs; j++){
        dampening = map(noise(j), 0, 1, 10, 100);
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