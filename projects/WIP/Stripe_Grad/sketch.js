function setup() {
  common_setup();
}
//***************************************************
function draw() {
  //bleed
  bleed_border = apply_bleed();

  //apply background
  background('black')

  //actual drawing stuff
  push();
  const ctx = canvas.getContext('2d');

  // Shadow
  ctx.shadowBlur = 5*global_scale;

  strokeCap(ROUND);
  center_rotate(random([90,270]));

  //line width
  ln_weight = 4*global_scale
  base_width = canvas_y;
  strokeWeight(ln_weight*2);
  // ctx.setLineDash([10, 50]);

  for(let i=-base_width; i<canvas_x; i+=base_width){
    c1 = random(palette);
    c2 = random(palette);
    while(c1 == c2){
      c2 = random(palette);
    };
    c3 = random(palette);
    while(c1==c3 || c2==c3){
      c3 = random(palette);
    };

    split_pt = constrain(floor(noise(i)*canvas_y), canvas_y/3, canvas_y*2/3);
    for(let j=0; j*ln_weight<canvas_y; j++){
      push();
        ln_width = noise(j)*base_width;
        if(j*ln_weight<split_pt){
          c = lerpColor(color(c1), color(c2), j*ln_weight/split_pt);
        }
        else{
          c = lerpColor(color(c2), color(c3), (j*ln_weight-split_pt)/(canvas_y-split_pt));
        }
        ctx.shadowColor = c;
        stroke(c);

        translate(i+base_width-ln_width/2, j*ln_weight);
        line(random(-ln_width, ln_width),0, ln_width,0);
      pop();
    }
  }
  pop();
  //cutlines
  apply_cutlines();
  
  save_drawing();
}
//***************************************************
//custom funcs




