//template globals
let input, button, randomize;


let hidden_controls = false;

// project globals
let palette, canvas_x, canvas_y;

//global func, can be blank
function reset_values(){
  //reset project values here for redrawing 
  canvas_x = 400*global_scale;
  canvas_y = 400*global_scale;
}

//***************************************************
function setup() {
  common_setup();
}
//***************************************************
function draw() {
  //set background, and remove that color from the palette
  bg = random(palette);
  background(bg);
  reduce_array(palette, bg);

  linear_spread = floor(random([0, 5]));
  arcing(canvas_x*.75, linear_spread);
}
//***************************************************
//custom funcs
function arcing(width, linear_spread){
  push();
  noFill();
  translate(canvas_x/2, canvas_y/2);
  for(let i=10; i<width; i++){
    translate(random(0,linear_spread), random(0, linear_spread));
    
    radius = i * random(0.2, 2);
    stroke(random(palette));
    strokeWeight(random(1, 10)*global_scale)
    arc(0, 0, radius, radius, 0, random(45,300));
    rotate(random(0,360));
  }
  pop();
}


