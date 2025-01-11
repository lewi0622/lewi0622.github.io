'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 10;

const suggested_palettes = [COTTONCANDY, SOUTHWEST, SIXTIES]

//project variables
const inc = 0.01*60/fr;   
const square_rate = 5; //10 frames
let squares, xoff, bg_c, last_color_id;

function gui_values(){
  parameterize("symmetries", floor(random(2,20)), 1, 50, 1, false);
}

function setup() {
  common_setup();
  gui_values();

  squares = [];
  xoff = 0;
  last_color_id = 0;

  palette = controlled_shuffle(palette, true);
  bg_c = color(random(palette));
  noStroke();
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();

  background(bg_c);

  //add new squares
  if(frameCount%square_rate==0) newSquares(squares);
  for(let i=0; i<squares.length; i++){
    push();
    const sq = squares[i];
    fill(sq.color);
    const square_inc = noise(xoff) * 5 * global_scale
    for(let i=0; i<symmetries; i++){
      center_rotate(360/symmetries);

      triangle(
        sq.x*sq.size, sq.y*sq.size, 
        sq.x-sq.size/2,sq.y-sq.size/2,
        sq.x-sq.size/2,sq.y+sq.size/2
      );
    }
    sq.size += square_inc;
    pop();
  }

  cullSquares(squares);

  xoff += inc;
  pop();
  
  global_draw_end();
}
//***************************************************
//custom funcs
function newSquares(arr){
  let new_c_id = floor(random(palette.length));
  while(new_c_id == last_color_id) new_c_id = floor(random(palette.length));
  last_color_id = new_c_id;
  const c = color(palette[new_c_id]);
  c.setAlpha(200);
  arr.push({
    x:canvas_x/4,
    y:canvas_y/4,
    size:0,
    color: c
  });
}

function cullSquares(arr){
  for(let i=0; i<arr.length; i++){
    if(arr[i].size > canvas_x/2 || arr[i].size > canvas_y/2){
      arr[i].color.setAlpha(lerp(arr[i].color.levels[3], 0, 0.3))
    }
    if(arr[i].color.levels[3] <= 10) arr.splice(i,1);
  }
}