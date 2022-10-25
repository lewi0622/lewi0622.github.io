'use strict';
//setup variables
const gif = true;
const fr = 30;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
let suggested_palette;

//project variables
const squares = [];
let xoff = 0;
const inc = 0.01*60/fr;   
const square_rate = 5; //10 frames
let square_inc = 3*global_scale;
let rot_offset = 0;
let bg_c, symmetries, rot_inc;

let gui_params = [];

function gui_values(){

}

function setup() {
  suggested_palette = random([COTTONCANDY, SOUTHWEST, SIXTIES]);
  common_setup(gif);

  palette = shuffle(palette, true);
  bg_c = color(random(palette));
  noStroke();

  symmetries = floor(random(2,11));
  rot_inc = random([-3,0,3]);
}
//***************************************************
function draw() {
  capture_start(capture);
  clear();
  //bleed
  const bleed_border = apply_bleed();
  //actual drawing stuff
  push();

  background(bg_c);

  center_rotate(45)

  //add new squares
  if(frameCount%square_rate==0){
    newSquares(squares);
  }
  
  squares.forEach(sq => {
    push();
    center_rotate(sq.rot);
    fill(sq.color);
    square_inc = map(noise(xoff), 0,1, 2,12)*global_scale;
    const size_inc = map(noise(xoff), 0,1, 0,square_inc);
    sq.radius = lerp(sq.radius, sq.size, 0.001*size_inc);
    for(let i=0; i<symmetries; i++){
      center_rotate(360/symmetries);

      triangle((sq.x)*sq.size,(sq.y)*sq.size, sq.x-sq.size/2,sq.y-sq.size/2, sq.x-sq.size/2,sq.y+sq.size/2)
    }
    sq.size += size_inc;
    pop();
  });

  cullSquares(squares);

  xoff += inc;
  pop();
  //cutlines
  apply_cutlines(bleed_border);

  capture_frame(capture);
}
//***************************************************
//custom funcs
function newSquares(arr){
  const c = color(random(palette))
  c.setAlpha(200);
  arr.push({
    x:canvas_x/4,
    y:canvas_y/4,
    size:1*global_scale,
    radius: 0,
    color: c,
    rot: rot_offset
  })
  rot_offset += rot_inc;
}

function cullSquares(arr){
  for(let i=0; i<arr.length; i++){
    if(arr[i].size > canvas_x/2 || arr[i].size > canvas_y/2){
      arr[i].color.setAlpha(lerp(arr[i].color.levels[3], 0, 0.3))
    }
    if(arr[i].color.levels[3] <= 10){
      arr.splice(i,1);
    }
  }
}