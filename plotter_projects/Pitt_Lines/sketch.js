'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
suggested_palettes = []


function gui_values(){
  parameterize("number_lines", random(10, 100), 1, 200, 1, false);
  parameterize("line_length", random(30,200), 1, 300, 1, true);
  parameterize("x_damp", random(5,30), 1, 100, 1, false);
  parameterize("y_damp", random(10, 50), 1, 100, 1, false);
  parameterize("sym_angs", ceil(random()*8), 1, 16, 1, false);
  parameterize("x_margin", random(-20,20), -100, 100, 1, true);
  parameterize("y_margin", random(-20,20), -100, 100, 1, true);
  parameterize("mirror", random([0,1]), 0, 1, 1, false);
  parameterize("rotation_per_line", 1, -10, 10, 0.1, false);
}

function setup() {
  common_setup(gif, SVG, 6*96, 6*96);
}
//***************************************************
function draw() {
  capture_start(capture);
  //bleed
  const bleed_border = apply_bleed();

  refresh_working_palette();
  //actual drawing stuff
  push();
  noFill();
  let c1 = color("RED");
  // let c2 = color("BLUE")
  let c2 = c1;
  c1.setAlpha(120);
  c2.setAlpha(120);
  stroke(c1);
  let weight = PITTPEN;
  strokeWeight(weight);
  translate(canvas_x/2, canvas_y/2);

  let rotation = 0;
  for(let j=0; j<sym_angs; j++){
    for(let z=0; z<mirror+1; z++){
      push();
      rotate(360/sym_angs*j);
      let direction = 1;
      if(z==1) direction = -1;

      // if(direction==0) stroke(c1);
      if(direction==1) stroke(c2);

      translate(x_margin*direction,y_margin);
      for(let i=0; i<number_lines; i++){
        rotate(rotation_per_line);
        let x=map(noise(i/x_damp), 0,1, 0, weight*2);
        translate(x*direction,0);
        let y=map(noise(i/y_damp), 0,1, -line_length/2, line_length/2);

        line(0, y, 0, y+line_length);
      }
      pop();
    }
  }

  pop();

  //cleanup
  apply_cutlines(bleed_border);

  capture_frame(capture);
}
//***************************************************
//custom funcs

