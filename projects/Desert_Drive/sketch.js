'use strict';
//setup variables
const gif = true;
const fr = 30;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
let palette;

//project variables
const noise_off = 50;
let xoff = 0;
let inc = 0.01*60/fr;
const waves = 10;

function setup() {
  common_setup(gif);

  palette = [
    "#F8B195",
    "#F67280",
    "#C06C84",
    "#6C5B7B",
    "#355C7D"
  ]


  
  const gradient = drawingContext.createLinearGradient(0, 0, 0, canvas_y*0.25);
  gradient.addColorStop(0,color(palette[0]));
  for(let i=1; i<palette.length;i++){
    gradient.addColorStop(i/(palette.length-1),color(palette[i]));  
  }
  
  drawingContext.fillStyle = gradient;
  
  const dir = random([-1,1])
  inc *= dir;

}
//***************************************************
function draw() {
  capture_start(capture);

  //bleed
  const bleed_border = apply_bleed();

  //actual drawing stuff
  let weight = 1/3*global_scale;
  background("#87CEEB");
  translate(0, canvas_y/waves);
  for(let j=0; j<waves; j++){
    blur = ((waves-(j+2))/3)
    if (blur<1.3){
      blur=1.3;
    }
    drawingContext.filter = 'blur('+blur+'px)';
    weight += (j/(waves*2))*global_scale;
    strokeWeight(weight)
    push();
    translate(0, j*canvas_y/waves)
    beginShape();
    const steps = 410;
    let y;
    for(let i=-10; i<steps; i++){
      //this needs to be simplified, my god, what a mess
      y = map(noise(noise_off*j + i/(100*(j+1))+xoff*((j+0.5)/5)), 0,1, -100,100);
      vertex(i*canvas_x/steps, y*global_scale);
    }
    vertex(canvas_x*1.5, y*global_scale)
    vertex(canvas_x*1.5, canvas_y);
    vertex(0, canvas_y);
    endShape(CLOSE);
    pop();
  }
  xoff += inc;
  //cutlines
  apply_cutlines(bleed_border);
  
  capture_frame(capture);
}