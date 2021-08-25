function reset_values(){
  //reset project values here for redrawing 
  xPos = 0;
  yPos = canvas_y/2;
}

//***************************************************
function setup() {
  common_setup();
}
//***************************************************
function draw() {
  bg = random(palette);
  background(bg);

  //get random bg function
  random(bgs)();

  strokeCap(SQUARE);
  strokeWeight(30*global_scale)
  noFill();
  shape_type=TRIANGLES
  beginShape(shape_type);
  for(let i=0; i<1000*global_scale; i++){
    stroke(random(palette));
    //vertex
    vertex(xPos, yPos);

    //move
    xPos += random(-5,10)*global_scale;
    yPos += random(-4,4)*global_scale;

    //check for wrapping
    wrap(undefined, canvas_y/2);
  }
  //don't stroke last line to avoid one that ends in the middle of the page
  noStroke();
  endShape();
  
  save_drawing();
}
//***************************************************
//custom funcs