gif = true;
fr = 30;

x_rot = 0;
x_inc = 1;

capture = false;
capture_time = 10;
function setup() {
  common_setup(gif);
  line_length = random([25, 40])*global_scale;
  rot = random(0, 360);
  rad = 50*global_scale;
  steps = 60;
  step_size = 360/steps;
  palette = shuffle(palette, true);
  bg_c = random(palette);
}
//***************************************************
function draw() {  
  capture_start(capture);
  //bleed
  bleed_border = apply_bleed();

  working_palette = JSON.parse(JSON.stringify(palette));
  strokeCap(random([PROJECT,ROUND]))

  //apply background
  background(bg_c)
  reduce_array(working_palette, bg_c);
  c_idx = 0;

  //actual drawing stuff
  push();
  
  translate(canvas_x/2, canvas_y/2);
  rotate(rot);

  noFill();
  strokeWeight(5*global_scale);
  stroke(working_palette[c_idx%working_palette.length]);
  c_idx++;
  circle(0,0, rad*2);
  circle(0,0, rad*3);
  circle(0,0, rad*4);
  circle(0,0, rad*5);

  for(let i=1; i<=steps; i++){
    push();
    noFill();
    strokeWeight(random(4,4)*global_scale);
    stroke(working_palette[c_idx%working_palette.length]);
    c_idx++;
    beginShape();
    if(i==0){
      curveVertex(rad*cos(i*step_size), rad*sin(i*step_size));      
    }
    curveVertex(rad*cos(i*step_size), rad*sin(i*step_size));
    x_len = [rad*1.5, rad*2, rad*2.5][i%3]
    curveVertex(x_len*cos(i*step_size),x_len*sin(i*step_size));
    
    x = canvas_y/2*sin(x_rot);
    y = canvas_y/2*cos(x_rot);
    if(i*step_size<180){
      x_len = x;
      y_len = y;
    }
    else{
      x_len = -x;
      y_len = -y;
    }
    curveVertex(x_len, y_len) 
    curveVertex(x_len, y_len) 
    endShape();
    strokeWeight(1*global_scale);
    pop();
  }
  fill(bg_c);
  pop();
  
  x_rot+=x_inc;

  //cutlines
  apply_cutlines();

  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs