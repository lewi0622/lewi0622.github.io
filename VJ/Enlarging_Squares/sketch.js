'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 10;

let bg_c, symmetries, rot_inc, shape;
const suggested_palettes = [COTTONCANDY, SIXTIES, SUPPERWARE];
//project variables
let xoff, squares, rot_offset;
const inc = 0.01*60/fr;

function gui_values(){
  parameterize("square_rate", 5, 1, 20, 1, false);

}

function setup() {
  common_setup();
  gui_values();

  xoff = 0;
  squares = [];
  rot_offset = 0;

  palette = controlled_shuffle(palette, true);
  bg_c = color(random(palette));
  noStroke();
  symmetries = floor(random(5,11));

  rot_inc = random([-3,0,3]);
  shape = random(['circle', 'square'])
  document.body.style.background = "BLACK";
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  background("BLACK")
  // background(bg_c);

  //add new squares
  if(frameCount%square_rate==0){
    newSquares(squares);
  }
  
  squares.forEach(sq => {
    push();
    center_rotate(sq.rot);
    fill(sq.color);
    const square_inc = map(noise(xoff), 0,1, 2,12);
    const size_inc = map(noise(xoff), 0,1, 0,square_inc);
    sq.radius = lerp(sq.radius, sq.size, 0.001*size_inc);
    for(let i=0; i<symmetries; i++){
      center_rotate(360/symmetries);
      switch(shape){
        case 'circle':
          circle(sq.x*global_scale, sq.y*global_scale, sq.size*global_scale);
          break;
        case 'square':
          square((sq.x-sq.size/2)*global_scale, (sq.y-sq.size/2)*global_scale, sq.size*global_scale, sq.radius*global_scale, sq.radius*global_scale, sq.radius*global_scale, sq.radius*global_scale);
          break;
        default: 
        break;
      }
    }
    sq.size += size_inc;
    pop();
  });

  cullSquares(squares);

  xoff += inc;
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
function newSquares(arr){
  let c = color(random(palette))
  c.setAlpha(200);
  arr.push({
    x:canvas_x/4/global_scale,
    y:canvas_y/4/global_scale,
    size:1,
    radius: 0, //corner factor
    color: c,
    rot: rot_offset
  })
  rot_offset += rot_inc;
}

//rewrite cull to check distance from edge
//fade when 80% of way to edge
//remove when at edge

function cullSquares(arr){
  for(let i=0; i<arr.length; i++){
    if(arr[i].size > base_x/4 || arr[i].size > base_y/4){  //Size check for starting fade
      arr[i].color.setAlpha(lerp(arr[i].color.levels[3], 0, 0.3))
    }
    if(arr[i].color.levels[3] <= 10){ //remove if faded enough
      arr.splice(i,1);
    }
  }
}