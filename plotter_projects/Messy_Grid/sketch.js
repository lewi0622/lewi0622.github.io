gif = false;
fr = 1;

capture = false;
capture_time = 10;
function setup() {
  suggested_palette = random([BUMBLEBEE, SIXTIES, SUPPERWARE]);
  common_setup(gif, SVG);

  num_grid = 16;
  grid_size = canvas_x/num_grid;
}
//***************************************************
function draw() {
  capture_start(capture);

  //bleed
  bleed_border = apply_bleed();

  background("#abada0")
  working_palette = JSON.parse(JSON.stringify(palette));
  strokeCap(SQUARE);

  //actual drawing stuff
  push();
  translate(grid_size/2, grid_size/2);

  x = floor(random(num_grid))*grid_size;
  y = floor(random(num_grid))*grid_size;
  steps = 100;

  noFill();
  dir = "vert";

  curveTightness(.9);
  beginShape();
  for(let i=0; i<steps; i++){
    curveVertex(x,y);
    //pick either row, or col and keep other constant
    if(dir == "vert"){
      new_x = x;
      while(new_x == x){
        x = floor(random(num_grid))*grid_size;
      }
      dir = "hori";
    }
    else{
      new_y = y;
      while(new_y == y){
        y = floor(random(num_grid))*grid_size;
      }
      dir = "vert";
    }
  }
  endShape();

  pop();
  //cutlines
  apply_cutlines();

  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs