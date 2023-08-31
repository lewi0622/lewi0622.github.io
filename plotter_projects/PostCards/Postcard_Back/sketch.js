'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

suggested_palettes = [SIXTIES]

function gui_values(){
}

function setup() {
  common_setup(8.5*96, 11*96, SVG);
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();

  //apply postcard lines
  noFill();
  rect(0,0,canvas_x, canvas_y);
  line(canvas_x/2, 0, canvas_x/2, canvas_y);
  line(0,canvas_y/2, canvas_x, canvas_y/2);

  //actual drawing stuff
  stroke("BLUE")
  for(let i=0; i<2; i++){
    for(let j=0; j<2; j++){
      push();
      translate(i*canvas_x/2, j*canvas_y/2);
      let address_spacing = 0.5*96;
      let margin = 0.25*96;
      //middle line
      line(margin, canvas_y/4, canvas_x/2-margin, canvas_y/4);
      //stamp space
      rect(margin, margin, 96, 0.75*96);
      //address lines
      for(let z=0; z<4; z++){
        line(canvas_x/4 + z * address_spacing, margin, canvas_x/4 + z * address_spacing, canvas_y/4-margin*2);
      }

      pop();
    }
  }

  global_draw_end();
}
//***************************************************
//custom funcs

