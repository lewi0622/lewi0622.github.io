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

  arcing(canvas_x*.5, 0, 0);

  save_drawing();
}
//***************************************************
//custom funcs
function arcing(width, linear_spread, rotation){
  push();
  noFill();
  translate(canvas_x/2, canvas_y/2);
  rotate(120);
  cap = random([ ROUND]);
  strokeCap(cap);
  for(let i=100*global_scale; i<width; i=i+(1*global_scale)){
    radius = i * random(0.2, 2);
    stroke(random(palette));

    strokeWeight(random(1, 10)*global_scale)

    arc(0, 0, radius, radius, 0, random(150,330));
    
    rotate(random(0,rotation));
  }
  pop();
  // clean up pyramid
  if(cap == ROUND){
    push();
    noStroke();
    fill(pyramid);
    translate(canvas_x/2, canvas_y/2);
    pyr_dist = 10*global_scale;
    beginShape();
    vertex(0,0);
    vertex(0,pyr_dist);
    vertex(-hyp+pyr_dist,canvas_y/2);
    vertex(-hyp,canvas_y/2);
    endShape();
    pop();
  }


}


