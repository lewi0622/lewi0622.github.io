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
  //bleed
  bleed_border = apply_bleed();

  //apply background
  random([bg_vertical_strips, bg_horizontal_strips])(random([2,3,4]));

  //actual drawing stuff

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
  

  //cutlines
  apply_cutlines();
  
  save_drawing();
}
//***************************************************
//custom funcs