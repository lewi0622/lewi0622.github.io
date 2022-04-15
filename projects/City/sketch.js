function setup() {
  common_setup();
}
//***************************************************
function draw() {
  //bleed
  bleed_border = apply_bleed();

  //apply background
  bg_c = bg(true);
  //actual drawing stuff
  push();
  size_buildings = random([20, 80])*global_scale;
  num_buildings = floor(canvas_x/size_buildings);

  var build_heights = new Array(num_buildings);

  //set global building array
  for(let i=0; i<num_buildings; i++){
    build_heights[i] = floor(constrain(noise(i)*(canvas_y/size_buildings)*1.5, 0, canvas_y/size_buildings));
  }

  translate(0, canvas_y-size_buildings);
  noStroke();
  for(let i=1; i<num_buildings; i++){
    push();
    translate(i*size_buildings, 0);
    if(build_heights[i]!=1){
      building_block(build_heights[i]);
    }
      pop();
  }
  pop();
  //cleanup
  apply_cutlines();
}
//***************************************************
//custom funcs
//helper functions based on building 
function center(){
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
    build_c = random(palette);
    fill(build_c);
    if(i+1 >= h){
      random([buildCap])();
    }
    else if(i+2 >= h){
      //no dias followed by cap, looks stupid
      random([buildColumns, buildWindow, buildArch, buildTinyWindows, buildStairs, buildBrickwork])();
    }
    else{
      func = random([buildColumns, buildDias, buildWindow, buildArch, buildTinyWindows, buildStairs, buildBrickwork]);
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
  //center
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
  window_width = size_buildings/window_scale;
  push();
  fill(bg_c)
  center();
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
    center();
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
  whole_c = random(palette);
  stair_color = whole_c;
  fill(whole_c);
  buildWhole();

  dir = random([-1,1]);
  if(dir == 1){
    low_left();
  }
  else{
    low_right();
  }
  while(stair_color == whole_c){
    stair_color = random(palette);
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
