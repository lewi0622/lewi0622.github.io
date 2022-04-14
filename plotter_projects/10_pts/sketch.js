type = 'svg';

function setup() {
  common_setup(false, SVG);
  
}
//***************************************************
function draw() {
  //bleed
  bleed_border = apply_bleed();

  //actual drawing stuff
  push();

  strokeWeight(1*global_scale);

  noFill();

  pts = 10;
  shape_rad = 40*global_scale;
  spacing = shape_rad * 2;
  zoff = 0;
  inc = 0.01;
  for(let i=spacing; i<canvas_x; i+=spacing){
    for(let j=spacing; j<canvas_y; j+=spacing){
      push();
      curveTightness(random(-5,5));
      translate(i, j);
      beginShape();
      for(let z=0; z<pts; z++){
        // curveVertex(random(-shape_rad,shape_rad), random(-shape_rad,shape_rad));
        curveVertex(map(noise(z+i-j+zoff), 0,1, -shape_rad, shape_rad), map(noise(z+i+j+zoff), 0,1, -shape_rad, shape_rad));
      }
      endShape();

      zoff += inc;
      pop();
    }
  }


  pop();

  //cleanup
  apply_cutlines();
}
//***************************************************
//custom funcs


