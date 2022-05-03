gif = true;
fr = 60;

xoff = 0;
xinc = 0.005*60/fr;

function setup() {
  common_setup(gif);
  frameRate(fr);
  noFill();
  // draw_line=true;
  colorMode(HSB);
}
//***************************************************
function draw() {
  //bleed
  bleed_border = apply_bleed();
  stroke(frameCount%360, 100, 100);

  //actual drawing stuff
  push();

  strokeWeight(1*global_scale);

  pts = 4;
  shape_rad = 150*global_scale;
  spacing = shape_rad;
  zoff = 0;
  zinc = 0.01;
  for(let i=spacing; i<canvas_x; i+=spacing){
    for(let j=spacing; j<canvas_y; j+=spacing){
      push();
      translate(i, j);
      beginShape();
      for(let z=0; z<pts; z++){
        curveVertex(map(noise(z+i-j+zoff+xoff), 0,1, -shape_rad, shape_rad), map(noise(z+i+j+zoff+xoff), 0,1, -shape_rad, shape_rad));
      }
      endShape();

      zoff += zinc;
      pop();
    }
  }

  xoff+=xinc;
  pop();

  //cleanup
  apply_cutlines();

  // if(frameCount ==359){
  //   noLoop();
  // }

}
//***************************************************
//custom funcs


