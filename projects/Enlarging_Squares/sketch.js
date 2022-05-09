gif = true;
fr = 30;

xoff = 0;
inc = 0.01*60/fr;

squares = [];
rot_offset = 0;

capture = false;
capture_time = 5
function setup() {
  suggested_palette = random([COTTONCANDY, SIXTIES, SUPPERWARE]);
  common_setup(gif);

  palette = shuffle(palette);
  bg_c = color(random(palette));
  noStroke();
  square_rate = 5; //10 frames
  // square_inc = 3*global_scale;
  symmetries = floor(random(5,11));

  rot_inc = random([-3,0,3]);
  shape = random(['circle', 'square'])
}
//***************************************************
function draw() {
  capture_start(capture);

  clear();
  //bleed
  bleed_border = apply_bleed();
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
    square_inc = map(noise(xoff), 0,1, 2,12);
    size_inc = map(noise(xoff), 0,1, 0,square_inc);
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
  //cutlines
  apply_cutlines();

  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs
function newSquares(arr){
  c = color(random(palette))
  c.setAlpha(200);
  arr.push({
    x:canvas_x/4/global_scale,
    y:canvas_y/4/global_scale,
    size:1,
    radius: 0,
    color: c,
    rot: rot_offset
  })
  rot_offset += rot_inc;
}

function cullSquares(arr){
  for(let i=0; i<arr.length; i++){
    if(arr[i].size*global_scale > canvas_x/2 || arr[i].size*global_scale > canvas_y/2){
      arr[i].color.setAlpha(lerp(arr[i].color.levels[3], 0, 0.3))
    }
    if(arr[i].color.levels[3] <= 10){
      arr.splice(i,1);
    }
  }
}