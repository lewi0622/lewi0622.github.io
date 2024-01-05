'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [BIRDSOFPARADISE];


function gui_values(){
  parameterize("horizontal_squares", 10, 1, 100, 1, false);
  parameterize("vertical_squares", 10, 1, 100, 1, false);
  parameterize("step_number", 10, 1, 100, 1, false);
  parameterize("horizontal_margin", 10, 0, 100, 1, true);
  parameterize("vertical_margin", 10, 0, 100, 1, true);
}

function setup() {
  common_setup(8*96, 10*96, SVG);
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();
  //actual drawing stuff
  push();
  noFill();
  
  const total_horizonatal_margin = horizontal_squares*(horizontal_margin+1);
  const total_vertical_margin = vertical_squares*(vertical_margin+1);
  const horizontal_square_size = (canvas_x-total_horizonatal_margin)/horizontal_squares;
  const vertical_square_size = (canvas_y-total_vertical_margin)/vertical_squares;
  let square_size=vertical_square_size;
  if(horizontal_square_size<vertical_square_size) square_size = horizontal_square_size;
  let step_size = square_size/step_number;

  let points = [];

  //define points along the four edges of the square
  for(let i=0; i<=step_number; i++){
    points.push({x:0, y:i*step_size}); //top
  }
  for(let i=0; i<=step_number; i++){
    points.push({x:square_size, y:i*step_size}); // bottom
  }
  for(let i=0; i<=step_number; i++){
    points.push({x:i*step_size, y:0}); // left
  }
  for(let i=0; i<=step_number; i++){
    points.push({x:i*step_size, y:square_size}); // right
  }

  translate(horizontal_margin, vertical_margin);
  for(let z=0; z<horizontal_squares; z++){
    for(let j=0; j<vertical_squares; j++){
      push();
      // stroke(random(working_palette));
      translate(z*(square_size+horizontal_margin), j*(square_size+vertical_margin));
      points = shuffle(points);
      for(let i=0; i<points.length-1; i++){
        const start = points[i];
        const end = points[i+1];
        
        line(start.x, start.y, end.x, end.y);
      }
      pop();
    }
  }

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs

