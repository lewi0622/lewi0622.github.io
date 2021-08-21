//template globals
let input, button, randomize;

let hidden_controls = false;

// project globals
let palette, xPos, yPos, canvas_x, canvas_y;
let base_x = 400;
let base_y = 400;

//global func, can be blank
function reset_values(){
  //reset project values here for redrawing 

  xPos = canvas_x/2;
  yPos = canvas_y/2;
}

//***************************************************
function setup() {
  common_setup();
}
//***************************************************
function draw() {
  //line width
  
  //set background, and remove that color from the palette
  bg = random(palette);
  background(bg);
  reduce_array(palette, bg);


  strokeWeight(1)
  noFill();
  shape_type=""
  beginShape(shape_type);
  for(let i=0; i<2000; i++){
    stroke(random(palette));
    //vertex
    vertex(xPos, yPos);

    //move
    xPos += random(-5,10);
    yPos += random(-5,7);

    //check for wrapping
    wrap();
  }
  endShape();
  
  save_drawing();
}
//***************************************************
//custom funcs

function wrap(){
  wrap_x = false;

  if(xPos > canvas_x){
    vertex(xPos, yPos);
    endShape();
    xPos = xPos - canvas_x;
    beginShape(shape_type);
    wrap_x = true;
  }
  else if(xPos < 0){
    vertex(xPos, yPos);
    endShape();
    xPos = xPos + canvas_x;
    beginShape(shape_type);
    wrap_x = true;
  };
  if(yPos > canvas_y){
    if(!wrap_x){
      vertex(xPos, yPos);
      endShape();
      yPos = yPos - canvas_y;
      beginShape(shape_type);
    }
    else{
      yPos = yPos - canvas_y;
    };
  }
  else if(yPos < 0){
    if(!wrap_x){
      vertex(xPos, yPos);
      endShape();
      yPos = yPos + canvas_y;
      beginShape(shape_type);
    }
    else{
      yPos = yPos + canvas_y;
    };
  };
}