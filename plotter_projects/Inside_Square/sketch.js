'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [BIRDSOFPARADISE];


function gui_values(){
  parameterize("horizontal_squares", floor(random(3,30)), 1, 100, 1, false);
  parameterize("step_number", floor(random(3, 20)), 1, 100, 1, false);
  parameterize("margin", random([0,5,10,15,20]), 0, 50, 1, true);
  parameterize("num_colors", round(random(1, working_palette.length-1)), 1, working_palette.length-1, 1, false);
}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  const vertical_squares = round(canvas_y/canvas_x*horizontal_squares);
  strokeWeight(1*global_scale);
  png_bg(true);
  controlled_shuffle(working_palette, true);
  const colors = [];
  for(let i=0; i<num_colors; i++){
    colors.push(color(working_palette[i]));
  }
  noFill();
  strokeJoin(BEVEL);
  const total_horizonatal_margin = (horizontal_squares-1) * margin;
  const total_vertical_margin = (vertical_squares-1) * margin;
  const horizontal_square_size = (canvas_x-total_horizonatal_margin)/horizontal_squares;
  const vertical_square_size = (canvas_y-total_vertical_margin)/vertical_squares;
  const square_size = min(horizontal_square_size, vertical_square_size);
  const step_size = square_size/step_number;

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

  translate((canvas_x-total_horizonatal_margin-square_size*horizontal_squares)/2, (canvas_y-total_vertical_margin-square_size*vertical_squares)/2);
  for(let z=0; z<horizontal_squares; z++){
    for(let j=0; j<vertical_squares; j++){
      push();
      const stroke_c = random(colors);
      stroke(stroke_c);
      line_blur(stroke_c, 2*global_scale);
      translate(z*(square_size+margin), j*(square_size+margin));
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

