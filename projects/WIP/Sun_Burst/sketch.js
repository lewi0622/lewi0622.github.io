function reset_values(){
  //reset project values here for redrawing 
  line_length = random([25, 40])*global_scale;
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
  bg_c = bg(true);

  //actual drawing stuff
  push();
  
  translate(canvas_x/2, canvas_y/2);
  rotate(random(0, 360));
  rad = 50*global_scale;
  steps = 60;
  step_size = 360/steps;
  terminators = 1;

  noFill();
  strokeWeight(5*global_scale);
  stroke(random(palette));
  circle(0,0, rad*3);
  circle(0,0, rad*4);
  circle(0,0, rad*5);

  for(let i=0; i<steps; i++){
    push();
    noFill();
    strokeWeight(random(4,4)*global_scale);
    stroke(random(palette));
    beginShape();
    vertex(rad*cos(i*step_size), rad*sin(i*step_size));
    x_len = random([rad*1.5, rad*2, rad*2.5]);
    vertex(x_len*cos(i*step_size),x_len*sin(i*step_size));
    if(i*step_size<180){
      y_len = canvas_y;
    }
    else{
      y_len = -canvas_y;
    }
    vertex(0, y_len) 
    endShape();
    strokeWeight(1*global_scale);
    pop();
  }
  fill(bg_c);
  circle(0,0, rad*2);
  //center

  //draw line striaght out, then bent

  //rotate and repeat


  pop();
  
  //cutlines
  apply_cutlines();
}
//***************************************************
//custom funcs




