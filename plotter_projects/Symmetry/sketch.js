type = 'svg';

gif = true;
fr = 30;

noise_off = 20;
xoff = 0;
inc = 0.3*60/fr;

//***************************************************
function setup() {
  common_setup(gif, SVG);
  frameRate(fr);

  sym_angs = random([4,6,8,10,12,14,16]);
  line_segs = floor(random(5,15));

  len = 800/(line_segs*constrain(sym_angs, 4,8));

  noFill();
  strokeWeight(1*global_scale);
}
//***************************************************
function draw() {
  //bleed
  bleed_border = apply_bleed();

  //actual drawing stuff
  push();
  translate(canvas_x/2, canvas_y/2);
  for(let i=0; i<sym_angs; i++){
    push();
      beginShape();
      for(let j=0; j<line_segs; j++){
        dampening = map(noise(j), 0, 1, 10, 100);
        x = floor(map(noise((j + xoff)/dampening), 0, 1, -canvas_x*.5, canvas_x*.5));
        y = floor(map(noise((j + xoff + noise_off)/dampening), 0,1, -canvas_y*.5, canvas_y*.5));
        if(j == 0){
          curveVertex(x, y);
        }
        curveVertex(x, y);
      }
      endShape(CLOSE);
    pop();
    rotate(360/sym_angs);
  }

  xoff+= inc;

  pop();
  //cutlines
  apply_cutlines();

  //stop drawing
  if(frameCount>len){
    noLoop();
  }
}
//***************************************************
//custom funcs




