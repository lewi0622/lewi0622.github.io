'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
suggested_palettes = [BEACHDAY, COTTONCANDY, NURSERY]

//project variables
let bg_c, size_buildings;


function gui_values(){

}

function setup() {
  common_setup();
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();
  strokeCap(random([PROJECT,ROUND]))

  //apply background
  bg_c = random(working_palette)
  background(bg_c)
  reduce_array(working_palette, bg_c)

  //actual drawing stuff
  push();
  const building_size = random([20, 80])
  let num_buildings;
  if(building_size==20){
    num_buildings = 19;
  }
  else{
    num_buildings = 4;
  }
  size_buildings = building_size*global_scale;
  //for scaling, round to nearest evennumber
  size_buildings = 2 * round(size_buildings/2);

  translate((canvas_x-size_buildings*(num_buildings+1))/2+size_buildings, floor(canvas_y-size_buildings));
  noStroke();
  for(let i=0; i<num_buildings; i++){
    push();
    translate(i*size_buildings, 0);
    const building_height = floor(map(noise(i*2), 0,1, 1,num_buildings+2));
    if(building_height!=1){
      building_block(building_height);
    }
    pop();
  }
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
//helper functions based on building 

function middle(){
  translate(0,size_buildings/2);
}
function low_left(){
  translate(-size_buildings/2, size_buildings);
}
function low_right(){
  translate(size_buildings/2, size_buildings);
}
function high_left(){
  translate(-size_buildings/2, 0);
}
function high_right(){
  translate(size_buildings/2, 0);
}


function building_block(h){
  //builds vertically
  push();
  for(let i=0; i<h; i++){
    let build_c = random(working_palette);
    fill(build_c);
    if(i+1 >= h){
      random([buildCap])();
    }
    else if(i+2 >= h){
      //no dias followed by cap, looks stupid
      random([buildColumns, buildWindow, buildArch, buildTinyWindows, buildStairs, buildBrickwork])();
    }
    else{
      let func = random([buildColumns, buildDias, buildWindow, buildArch, buildTinyWindows, buildStairs, buildBrickwork]);
      if(func == buildColumns){
        func(random([2,3]));
      }
      else{
        func();
      }
    }
    translate(0,-size_buildings);
  }
  pop();
}

function buildColumns(num_cols){
  if(num_cols == undefined){
    num_cols = 2;
  };
  push();
  low_left();
  for(let i=0; i<num_cols; i++){
    buildColumn(size_buildings/num_cols);
    translate(size_buildings/num_cols,0);
  }
  pop();
}

function buildColumn(col_width){
  //TODO convert to use bezier vertex
  if(col_width == undefined){
    col_width = size_buildings;
  };
  push();
  curveTightness(1);
  beginShape();
  //ll
  curveVertex(0,0);
  curveVertex(0,0);
  curveVertex(col_width/4, -col_width/4);
  curveVertex(col_width/4, -size_buildings+col_width/4);
  //ul
  curveVertex(0,-size_buildings);
  //ur
  curveVertex(col_width,-size_buildings);
  curveVertex(col_width*3/4, -size_buildings+col_width/4);
  curveVertex(col_width*3/4, -col_width/4);
  curveVertex(col_width, 0);

  endShape(CLOSE);
  pop();
}

function buildDias(){
  push();
  rect(-size_buildings/8, 0, size_buildings/4, size_buildings);
  arc(0,0, size_buildings*3/4, -size_buildings/4, 0, 180);
  translate(0,size_buildings);
  rotate(180);
  arc(0,0, size_buildings*3/4, -size_buildings/4, 0, 180);
  pop();
}

function buildWhole(){
  push();
  high_left();
  rect(0, 0,size_buildings,size_buildings);
  pop();
}

function buildArch(){
  buildWhole();
  buildWindow(2);
}

function buildTinyWindows(){
  buildWhole();
  push();
  //middle
  buildWindow(8);
  //left
  translate(-size_buildings/4,0);
  buildWindow(8);
  //right
  translate(size_buildings/2,0);
  buildWindow(8);
  pop();
}

function buildWindow(window_scale){
  if(window_scale == undefined){
    window_scale = 4;
    buildWhole();
  }
  const window_width = size_buildings/window_scale;
  push();
  fill(bg_c)
  middle();
  rect(-window_width/2, 0, window_width, window_width);
  circle(0,0,window_width);
  pop();
}

function buildBrickwork(){
  //brickwork, mortar is bg_c
  buildWhole();
  
  push();
  strokeCap(SQUARE);
  stroke(bg_c);
  strokeWeight(1*global_scale);
  high_left();
  //offset first row
  
  for(let j=1; j<9; j++){
    //vertical lines
    let bricks;
    push();
    if(j%2 == 0){
      translate(size_buildings/8, (j-1)*size_buildings/8);
      bricks = 4;
    }
    else{
      translate(size_buildings/4, (j-1)*size_buildings/8);
      bricks = 3;
    }
    for(let i=0; i<bricks; i++){
      line(0,0, 0, size_buildings/8);
      translate(size_buildings/4,0);
    }
    pop();
    //horizontal lines
    push();
    if(j!=8){
      translate(0, j*size_buildings/8);
      line(0,0, size_buildings,0);
    }
    pop();
  }

  pop();
}

function buildCap(){
  arc(0,size_buildings, -size_buildings, size_buildings, 180, 0)
  if(random([0,1]) == 0){
    circle(0,size_buildings/2,size_buildings/2);
    if(random([0,1]) == 0){
      circle(0, size_buildings/4, size_buildings/4);
    }
  }
  //spire/flagpole
  if(random([0,1,1]) == 0){
    push();
    middle();
    rect(-size_buildings/20, size_buildings/2, size_buildings/10, -size_buildings);
    circle(0, -size_buildings/2, size_buildings/10);
    pop();
  }
}

function buildHalfArch(){
  //TODO FINISH ARCH CURVE
  push();
  dir = random([-1,1]);
  if(dir == 1){
    low_left();
  }
  else{
    low_right();
  }

  beginShape();
  vertex(0,0);
  vertex(0,-size_buildings);
  vertex(size_buildings*dir,-size_buildings);
  vertex(size_buildings*dir, -size_buildings*3/4);
  bezierVertex(size_buildings/4*dir,-size_buildings*3/4, size_buildings/4*dir,-size_buildings*3/4, size_buildings/4*dir,0);
  endShape();
  pop();
}

function buildStairs(){
  push();
  let whole_c = random(working_palette);
  let stair_color = whole_c;
  fill(whole_c);
  buildWhole();

  const dir = random([-1,1]);
  if(dir == 1){
    low_left();
  }
  else{
    low_right();
  }
  while(stair_color == whole_c){
    stair_color = random(working_palette);
  }

  fill(stair_color);
  beginShape();
  for(let i=0; i<8; i++){
    vertex(size_buildings*(1+i)/8*dir, -size_buildings*i/8);

    if(i != 7){
      vertex(size_buildings*(1+i)/8*dir,-size_buildings*(1+i)/8);
    }
  }
  vertex(size_buildings*dir,0);
  endShape(CLOSE);
  pop();
}



//building ideas
//convex edges
//large tower top if no other buildings to left/right
//columns
//rooftop patio across two equal height
//patio if only height 1
//lights, laundry, banners strung across valley, between equal heights
//tree with brickwork base
//fountain with brickbase
//awnings?
//belltower
//make windows work with brick??
