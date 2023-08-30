'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 8


function gui_values(){

}

function setup() {
  common_setup(6*96, 6*96, SVG);
}
//***************************************************
function draw() {
  global_draw_start();

  //project variables
  const num_grid = 16;
  const grid_size = canvas_x/num_grid;

  //actual drawing stuff
  push();
  translate(grid_size/2, grid_size/2);

  let x = floor(random(num_grid))*grid_size;
  let y = floor(random(num_grid))*grid_size;
  const steps = 500;

  noFill();
  let dir = "vert";

  let x_1 = x;
  let y_1 = y;
  let x_2 = x;
  let y_2 = y;

  for(let i=0; i<steps; i++){
    curveTightness(1);
    if(x<canvas_x/4 || x>canvas_x*3/4 || y<canvas_y/4 || y>canvas_y*3/4){
      curveTightness(0.9);
    } 
    beginShape();

    curveVertex(x_2, y_2);
    curveVertex(x_1, y_1);
    curveVertex(x,y);
    curveVertex(x,y);

    x_2 = x_1;
    y_2 = y_1;
    x_1 = x;
    y_1 = y;

    //pick either row, or col and keep other constant
    if(dir == "vert"){
      const new_x = x;
      while(new_x == x){
        x = floor(random(num_grid))*grid_size;
      }
      dir = "hori";
    }
    else{
      const new_y = y;
      while(new_y == y){
        y = floor(random(num_grid))*grid_size;
      }
      dir = "vert";
    }
    endShape();
  }


  pop();
  global_draw_end();
}
//***************************************************
//custom funcs