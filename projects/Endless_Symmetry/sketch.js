gif = true;
fr = 30;

noise_off = 20;
xoff = 0;
inc = 0.1*60/fr;

//***************************************************
function setup() {
  common_setup(gif);
  frameRate(fr);
  //apply background
  sym_angs = random([4,6,8,10,12,14,16]);
  line_segs = floor(random(5,20));
  background("BLACK");
  drawingContext.shadowBlur=3*global_scale;

  line_color = color(255, 227, 92);
  drawingContext.shadowColor = color(line_color)
  stroke(line_color);
}
//***************************************************
function draw() {
  background("BLACK");
  //bleed
  bleed_border = apply_bleed();

  //actual drawing stuff
  push();
  for(let i=0; i<sym_angs; i++){
    push();
      translate(canvas_x/2, canvas_y/2);
      noFill();
      strokeWeight(1*global_scale);
      beginShape();
      for(let j=0; j<line_segs; j++){
        dampening = map(noise(j), 0, 1, .1, 100);
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
  apply_cutlines();
  
}
//***************************************************
//custom funcs




