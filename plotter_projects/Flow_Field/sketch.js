'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 30;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
suggested_palettes = []

function gui_values(){
  parameterize('inc', 0.1, 0.01, 10, 0.01, false);
  parameterize("zinc", 0.1, 0, 1, 0.01, false);
  parameterize("scl", 10, 1, 100, 1, true);
  parameterize("z_iterations", 1, 1, 100, 1, false);
}

function setup() {
  common_setup(8*96, 6*96, SVG);
}
//***************************************************
function draw() {
  global_draw_start(false);

  let rows = floor(canvas_y / scl);
  let cols = floor(canvas_x / scl);
  //actual drawing stuff

  let c1 = color("RED");
  let c2 = color("BLUE");
  c1.setAlpha(100);
  c2.setAlpha(100);
  stroke(c1);
  push();
  let zoff=0;
  for(let z=0; z<z_iterations; z++){
    if(z==1)stroke(c2);
    let yoff=0;
    for(let y=0; y<rows; y++){
      let xoff=0;
      for(let x=0; x<cols; x++){
        let index = x + y * cols;
        let angle = noise(xoff, yoff, zoff) * 360;
        let v = p5.Vector.fromAngle(radians(angle));
        xoff += inc; 
        push();
        translate(x*scl, y*scl);
        rotate(degrees(v.heading()));
        line(0,0,scl,0);
        pop();
      }
      yoff += inc;
    }
    zoff += zinc;
  }
  pop();
  
  global_draw_end();
}
//***************************************************
//custom funcs