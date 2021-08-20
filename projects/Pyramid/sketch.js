//template globals
let input, button, randomize;

let up_scale = 1;
let canvas_x = 400*up_scale;
let canvas_y = 400*up_scale;
let hidden_controls = false;

// project globals
let line_length = 60*up_scale;
let tile_width = canvas_x / line_length;
let tile_height = canvas_y / line_length;
let palette, bg, pyramid;

//global func, can be blank
function reset_values(){
  //reset project values here for redrawing 
  palette = JSON.parse(JSON.stringify(global_palette));
}

//***************************************************
function setup() {
  common_setup();
}
//***************************************************
function draw() {  
  //set background, and remove that color from the palette
  bg = random(palette)
  background(bg);
  reduce_array(palette, bg);

  pyramid = random(palette)
  reduce_array(palette, pyramid);

  push();
  noStroke();
  fill(pyramid);
  translate(canvas_x/2, canvas_y/2);
  leg = (canvas_y/2)/cos(30);
  hyp = leg * sin(30);
  triangle(0,0, hyp,canvas_y/2, -hyp,canvas_y/2);
  pop();

  linear_spread = floor(random([0, 5]));
  arcing(canvas_x*.5, linear_spread, 0);
}
//***************************************************
//custom funcs
function arcing(width, linear_spread, rotation){
  push();
  noFill();
  translate(canvas_x/2, canvas_y/2);
  pac_angle = rotate(120);
  cap = random([SQUARE, ROUND]);
  strokeCap(cap);
  for(let i=100; i<width; i++){
    radius = i * random(0.2, 2);
    stroke(random(palette));

    strokeWeight(random(1, 10)*up_scale)

    arc(0, 0, radius, radius, 0, random(150,330));
    
    rotate(random(0,rotation));
  }
  pop();
  // clean up pyramid
  if(cap == ROUND){
    console.log(cap);
    push();
    noStroke();
    fill(pyramid);
    translate(canvas_x/2, canvas_y/2);
    pyr_dist = 10*up_scale;
    beginShape();
    vertex(0,0);
    vertex(0,pyr_dist);
    vertex(-hyp+pyr_dist,canvas_y/2);
    vertex(-hyp,canvas_y/2);
    endShape();
    pop();
  }


}


