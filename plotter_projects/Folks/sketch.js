'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 2;

const suggested_palettes = [];

let bg_c;

//vary h/w of individual people
//add variation/curve to top of dress
//add flair/movement lines
//hats?

function gui_values(){
  parameterize("cols", 5, 1, 100, 1, false);
  parameterize("rows", 5, 1, 100, 1, false);
  parameterize("limb_thickness", 10, 1, 50, 1, false);
  parameterize("limb_mult", 0.005, 0.001, 0.5, 0.001, false);
} 

function setup() {
  common_setup();
  gui_values();
  bg_c = png_bg(true);
}
//***************************************************
function draw() {
  global_draw_start();
  if(type == "png") background(bg_c);
  strokeCap(ROUND);
  noFill();
  //actual drawing stuff
  push();
  const col_step = canvas_x/cols;
  const row_step = canvas_y/rows;
  const folk_width = col_step*0.8;
  const folk_height = row_step*0.8;
  const weight = LEPEN * global_scale;
  strokeWeight(weight);

  translate(col_step/2, row_step/2);


  for(let i=0; i<cols; i++){
    for(let j=0; j<rows; j++){
      push();
      translate(i * col_step, j* row_step); //move to grid upper left corner


      translate(col_step/2, row_step/2); //move to center of grid
      rotate(random(-10,10));
      translate(-col_step/2, -row_step/2);//move back to upper left corner
      // rectMode(CENTER);
      // rect(0,0,col_step, row_step);
      folk(folk_width, folk_height, weight);
      pop();  
    }
  }


  pop();
  global_draw_end();
}
//***************************************************
//custom funcs

function folk(w,h, weight){
  arms(w,h, limb_thickness);
  legs(w,h, limb_thickness);
  dress(w,h, weight);
  head(w,h,weight);
}

function head(w,h, interval){
  let head_w = random(0.7, 0.9)*w/8;
  let head_h = random(1,1.5)*head_w;
  let head_size = min(head_w, head_h);
  translate(head_size*random(-0.5,0.5), head_size*random(-0.25, 0.25));//random offset
  translate(0, -h*0.4); //normal head position
  rotate(random(-10,10));
  while(head_size>0){
    push();
    ellipse(0,0, head_w, head_h);
    head_w -= interval;
    head_h -= interval;
    head_size -= interval;
    pop();
  }
}


function dress(w, h, weight){
  //consider extracting individual bezier curves out from the dress fill for detail work on top
  //obscurs ends of arms/legs
  push();
  const dress_c = color(random(working_palette));

  if(type == "png") fill(dress_c);
  else dress_c.setAlpha(100);
  stroke(dress_c);

  const upper_left = {x: -w/8, y: -h/4};
  const upper_right = {x: w/8, y: -h/4};
  const lower_left = {x: -w/4, y: random(0.8, 1.6)*h/4};
  const lower_right = {x: w/4, y: random(0.8,1.1)*lower_left.y};
  let left_control_x = random(0,w/8);
  let left_control_y = upper_left.y;
  let right_control_x = random(-w/8, 0);

  while(max(lower_left.y, lower_right.y)>0){
    const step = weight;
    upper_left.x = constrain(upper_left.x + step, upper_left.x, 0);
    if(upper_left.x > -w/16) upper_left.y += step;

    upper_right.x = constrain(upper_right.x - step, 0, upper_right.x);
    if(upper_right.x < w/16) upper_right.y += step;

    lower_left.x = constrain(lower_left.x + step, lower_left.x, 0);
    lower_left.y -= step;

    lower_right.x = constrain(lower_right.x - step, 0, lower_right.x);
    lower_right.y -= step;

    left_control_x = constrain(left_control_x + step, left_control_x, 0);
    left_control_y = constrain(left_control_y + step, left_control_y, 0);
    right_control_x = constrain(right_control_x - step, 0, right_control_x);

    beginShape();
    vertex(upper_left.x, upper_left.y); //upper left
    bezierVertex(//lower left
      left_control_x, left_control_y, 
      lower_left.x, lower_left.y, 
      lower_left.x, lower_left.y); 
    bezierVertex(//lower right
      lower_left.x, lower_left.y, 
      lower_right.x, lower_right.y, 
      lower_right.x, lower_right.y); 
    bezierVertex(// upper right
      lower_right.x, lower_right.y, 
      right_control_x, upper_right.y, 
      upper_right.x, upper_right.y); 
    endShape(CLOSE);

    if(type == "png") break;
  }

  pop();
}

function arms(w, h, num_lines){
//arms and legs should use beizer curves with slightly varying control points to go from thin to thick to thin

//left arm, start on the outer edge
const left_x = -w*0.4;
const left_y = random(-h/2, h/4);
let control_y = left_y + random(-h/4,h/4);
const left_body_x = -w/8;
const left_body_y = -h/4;

//flair code
push();
noFill();
// get angle from shoulder to tip of hand
// rotate in accordance to the angle
// bezier segments beyond the tip of the hand
// look at keith harring

pop();
//flair code end

// beginShape();
// vertex(left_x, left_y);

for(let i=0; i<num_lines; i++){ //TODO rework for pen size
  bezier(left_x, left_y, left_x, control_y, left_body_x, left_body_y, left_body_x, left_body_y);
  control_y += limb_mult*h;
  // bezierVertex(left_body_x, left_body_y, left_x, control_y, left_x, left_y);
}

// endShape();

//right arm, start on the outer edge
const right_x = w*0.4;
const right_y = random(-h/2, h/4);
control_y = right_y + random(-h/4,h/4);
const right_body_x = w/8;
const right_body_y = -h/4;

// beginShape();
// vertex(right_x, right_y);

for(let i=0; i<num_lines; i++){ //TODO rework for pen size
  bezier(right_x, right_y, right_x, control_y, right_body_x, right_body_y, right_body_x, right_body_y);
  control_y += limb_mult*h;
  // bezierVertex(right_body_x, right_body_y, right_x, control_y, right_x, right_y);
}

// endShape();

}

function legs(w, h, num_lines){
//arms and legs should use beizer curves with slightly varying control points to go from thin to thick to thin

//left leg, start on the outer edge
let leg_x = random(-w/2,w/8);
let leg_y = h/2;
let control_x = leg_x + random(-w/4,w/4);
let body_x = -w/16;
let body_y = h/8;

// beginShape();
// vertex(leg_x, leg_y);

for(let i=0; i<num_lines; i++){ //TODO rework for pen size
  bezier(leg_x, leg_y, control_x, leg_y, body_x, body_y, body_x, body_y);
  control_x += limb_mult*h;
  // bezierVertex(body_x, body_y, control_x, leg_y, leg_x, leg_y);
}

// endShape();

//right leg, start on the outer edge
leg_x = random(-w/8,w/2);
leg_y = h/2;
control_x = leg_x + random(-w/4,w/4);
body_x = w/16;
body_y = h/8;

// beginShape();
// vertex(leg_x, leg_y);

for(let i=0; i<num_lines; i++){ //TODO rework for pen size
  bezier(leg_x, leg_y, control_x, leg_y, body_x, body_y, body_x, body_y);
  control_x += limb_mult*h;
  // bezierVertex(body_x, body_y, control_x, leg_y, leg_x, leg_y);
}

// endShape();

}

function perimeter_flair(){ //keith harring style shooting lines around person, centered

}

function curved_flair(x, y, w, h){ //keith harring style movement lines

}