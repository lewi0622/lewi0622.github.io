//setup variables
const gif = false;
const fr = 1;
const capture = false;
const capture_time = 8;

function setup() {
  common_setup(gif, SVG);
}
//***************************************************
function draw() {
  capture_start(capture);
  //bleed
  const bleed_border = apply_bleed();

  //actual drawing stuff
  push();

  strokeWeight(1*global_scale);

  noFill();
  const  colors = gen_n_colors(4);
  stroke(colors[0]);
  const pts = 75;
  const shape_rad = 40*global_scale;
  const spacing = shape_rad * 2;
  let zoff = 0;
  const inc = 0.01;
  let counter = 0;
  for(let i=spacing; i<canvas_x; i+=spacing){
    for(let j=spacing; j<canvas_y; j+=spacing){
      push();
      if(j==i){
        //central row outline
        stroke(colors[2]);
        circle(i,j, shape_rad*2);
        circle(i,j, shape_rad*2+global_scale)

        //central row
        stroke(colors[1]);
      }
      else{
        push();
        stroke(colors[3]);
        circle(i,j, shape_rad*2);
        circle(i,j, shape_rad*2+global_scale);
        pop();
      }
      // curveTightness(random(-5,5));
      strokeJoin(ROUND)
      translate(i, j);
      beginShape();
      for(let z=0; z<pts; z++){
        // curveVertex(random(-shape_rad,shape_rad), random(-shape_rad,shape_rad));
        // vertex(map(noise(z+i-j+zoff), 0,1, -shape_rad, shape_rad), map(noise(z+i+j+zoff), 0,1, -shape_rad, shape_rad));
        const ang = map(noise(z + counter + i + j + zoff), 0,1, 0,1080);
        vertex(shape_rad*cos(ang), shape_rad*sin(ang));

      }
      endShape();
      zoff += inc;
      counter++;
      pop();
    }
  }

  pop();

  //cleanup
  apply_cutlines(bleed_border);

  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs


