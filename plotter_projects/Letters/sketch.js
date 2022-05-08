let font;
function preload() {
  font = loadFont('..\\..\\fonts\\SquarePeg-Regular.ttf');
}

gif = false;
fr = 1;
capture = false;
capture_time = 10;
function setup() {
  common_setup(gif, SVG);
}
//***************************************************
function draw() {
  capture_start(capture);
  //bleed
  bleed_border = apply_bleed();

  //actual drawing stuff
  push();

  strokeWeight(1*global_scale);

  noFill();
  stroke('BLACK')

  pts = 10;
  shape_rad = 40*global_scale;
  spacing = shape_rad * 2;
  zoff = 0;
  inc = 0.01;
  translate(canvas_x/4, canvas_y/2);

  letters = Array.from("DAD");
  letters.forEach((l,idx) => {
    points = font.textToPoints(l, idx*40*global_scale,0, 100*global_scale, {
      sampleFactor: 1,
      simplifyThreshold: 1
    });
  
    curveTightness(0);
    beginShape();
    curveVertex(points[0].x, points[0].y);
    points.forEach(p => {
      curveVertex(p.x, p.y);
    });
    endShape();
  });


  

  // for(let i=spacing; i<canvas_x; i+=spacing){
  //   for(let j=spacing; j<canvas_y; j+=spacing){
  //     push();
  //     curveTightness(random(-5,5));
  //     translate(i, j);
  //     beginShape();
  //     for(let z=0; z<pts; z++){
  //       // curveVertex(random(-shape_rad,shape_rad), random(-shape_rad,shape_rad));
  //       curveVertex(map(noise(z+i-j+zoff), 0,1, -shape_rad, shape_rad), map(noise(z+i+j+zoff), 0,1, -shape_rad, shape_rad));
  //     }
  //     endShape();

  //     zoff += inc;
  //     pop();
  //   }
  // }


  pop();

  //cleanup
  apply_cutlines();

  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs


