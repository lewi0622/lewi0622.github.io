gif = true;
fr = 30;

xoff = 0;
inc = 0.01*60/fr;
square_inc = 5*60/fr;

function setup() {
  common_setup(gif);
  frameRate(fr);
  squares = [];
  palette = shuffle(palette);
  background(random(palette));
  noStroke();
  c_id = 0;
  square_rate = 10; //10 frames
  // createLoop({duration:10, gif:{fileName:"instanceMode.gif"}})
}
//***************************************************
function draw() {
  clear();
  //bleed
  bleed_border = apply_bleed();

  //actual drawing stuff
  push();

  //add new squares
  if(frameCount%square_rate==0){
    newSquares(squares);
  }

  squares.forEach(sq => {
    fill(sq.color);
    c_id++;
    size_inc = map(noise(xoff), 0,1, 0,square_inc);
    if(size_inc > 0){
      sq.radius = lerp(sq.radius, sq.size, 0.001*size_inc);
    }
    else{
      sq.radius = lerp(sq.radius, 0, 0.1*Math.abs(size_inc));
    }
    if(sq.radius<0){
      sq.radius = 0;
    }
    square(sq.x-sq.size/2, sq.y-sq.size/2, sq.size, sq.radius, sq.radius, sq.radius, sq.radius);
    sq.size += size_inc;
  });

  cullSquares(squares);

  xoff += inc;
  pop();
  //cutlines
  apply_cutlines();
}
//***************************************************
//custom funcs
function newSquares(arr){
  // c = color(palette[c_id%palette.length])
  c = color(random(palette))
  c.setAlpha(100);
  c_id ++;
  arr.push({
    x:canvas_x/4,
    y:canvas_y/4,
    size:1*global_scale,
    radius: 0,
    color: c
  })
  arr.push({
    x:canvas_x*3/4,
    y:canvas_y/4,
    size:1*global_scale,
    radius: 0,
    color: c
  })
  arr.push({
    x:canvas_x*3/4,
    y:canvas_y*3/4,
    size:1*global_scale,
    radius: 0,
    color: c
  })
  arr.push({
    x:canvas_x/4,
    y:canvas_y*3/4,
    size:1*global_scale,
    radius: 0,
    color: c
  })
}

function cullSquares(arr){
  for(let i=0; i<arr.length; i++){
    if(arr[i].size > canvas_x/2 || arr[i].size > canvas_y/2){
      arr[i].color.setAlpha(lerp(arr[i].color.levels[3], 0, 0.07))
    }
    if(arr[i].color.levels[3] <= 0){
      arr.splice(i,1);
    }
  }
}