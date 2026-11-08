'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 2;
const capture = false;
const capture_time = 20;

const suggested_palettes = [];

let bg_c, global_dress_path;

//add flair/movement lines
//could vary dress shape more wildly now that I'm not filling it

//create a drawing tool that stores spline points in an array

function gui_values(){
  parameterize("cols", floor(random(2,10)), 1, 100, 1, false);
  parameterize("rows", floor(random(1,cols)), 1, 100, 1, false);
  parameterize("min_limb_thickness", 4, 1, 50, 1, false);
  parameterize("max_limb_thickness", 15, 1, 50, 1, false);
  parameterize("limb_mult", 0.025, 0.001, 0.5, 0.001, false);
} 

function setup() {
  common_setup();
  gui_values();
  bg_c = png_bg(true);
}
//***************************************************
function draw() {
  global_draw_start();

  if(save_svg) endRecordSvg();

  if(type == "png") background(bg_c);
  strokeCap(ROUND);
  noFill();
  //actual drawing stuff
  push();
  const col_step = canvas_x/cols;
  const row_step = canvas_y/rows;

  const weight = LEPEN * global_scale;
  strokeWeight(weight);

  const folk_array = [];
  for(let i=0; i<rows * cols; i++){
    const w = col_step*random(0.5, 0.8);
    const h = row_step*random(0.6, 0.8);
    folk_array.push(generate_folk(w, h));
  }

  /*
  rewrite to export two layers per person

  */

  //display case
  if(!save_svg){
    let folk_counter = 0;
    for(let i=0; i<cols; i++){
      for(let j=0; j<rows; j++){
        const current_folk = folk_array[folk_counter];
        push();
        translate_folk(current_folk, col_step, row_step, i, j);
        draw_png_folk(current_folk, weight);
        pop();
        folk_counter++;
      }
    }
  } else{ //save svg case
    let folk_counter = 0;
    for(let i=0; i<cols; i++){
      for(let j=0; j<rows; j++){
        let new_filename = folk_counter + "_people_" + filename;
        beginRecordSvg(new_filename);
        const current_folk = folk_array[folk_counter];
        push();
        translate_folk(current_folk, col_step, row_step, i, j);
        draw_svg_folk(current_folk, weight);
        pop();
        endRecordSvg();
        new_filename = folk_counter + "_dress_" + filename;
        beginRecordSvg(new_filename); 
        push();
        translate_folk(current_folk, col_step, row_step, i, j);
        draw_svg_pattern(current_folk, weight);
        pop();
        endRecordSvg();
        folk_counter++;
      }
    }
  }
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
function translate_folk(folk, col_step, row_step, i, j){
  translate(col_step/2, row_step/2);
  translate(i * col_step, j* row_step); //move to grid upper left corner
  translate(col_step/2, row_step/2); //move to center of grid
  rotate(folk.rotation_amt);
  translate(-col_step/2, -row_step/2);//move back to upper left corner
  noFill();
}


function draw_png_folk(folk, weight){
  push();
  arms(folk.limb_thickness, folk.w, folk.h);
  legs(folk.limb_thickness, folk.w, folk.h);
  head(weight, folk.w, folk.h);
  global_dress_path = folk.dress_path;
  push();
  push();
  noStroke();
  fill(bg_c);
  if(type == "svg") fill("WHITE");
  draw_dress();
  pop();

  clip(draw_dress)
  polka_dots(weight, folk.w, folk.h);
  pop();
  stroke(folk.dress_c);
  strokeWeight(POSCA * global_scale);
  draw_dress();
  pop();
}

function draw_svg_folk(folk, weight){
  push();
  arms(folk.limb_thickness, folk.w, folk.h);
  legs(folk.limb_thickness, folk.w, folk.h);
  head(weight, folk.w, folk.h);
  global_dress_path = folk.dress_path;
  stroke(folk.dress_c);
  strokeWeight(POSCA * global_scale);
  draw_dress();
  pop();
}

function draw_svg_pattern(folk, weight){
  push();
  polka_dots(weight, folk.w, folk.h);
  global_dress_path = folk.dress_path;
  stroke(folk.dress_c);
  strokeWeight(POSCA * global_scale);
  draw_dress();
  pop();
}


function polka_dots(weight, w, h){
  push();
  translate(-w/2, -h/2);

  const polka_rad = min(w,h)/random(20,30);
  const x_step = polka_rad * 2 * random(0.9, 1.1);
  const y_step = polka_rad * 2 * random(0.9, 1.1);
  const columns = round(w/x_step)
  const rows = round(h/y_step);
  translate(random(x_step), random(y_step));
  for(let i=0; i<columns; i++){
    for(let j=0; j<rows; j++){
      push();
      translate(i * x_step, j * y_step);
      if(j %2==0)translate(x_step/2,0);
      let radius = 0.1*global_scale;
      while(radius <polka_rad){
        circle(0,0,radius);
        radius += weight;
      }
      pop();
    }
  }
  pop();
}

function generate_folk(w, h){
  const limb_thickness = floor(random(min_limb_thickness, max_limb_thickness));
  const rotation_amt = random(-10,10);
  const dress_path = generate_dress(w,h)
  const dress_c = color(random(working_palette))
  return {
    w:w,
    h:h,
    limb_thickness: limb_thickness,
    rotation_amt: rotation_amt,
    dress_path: dress_path,
    dress_c: dress_c
  }
}

function generate_dress(w,h){
  //obscurs ends of arms/legs
  const upper_left = {x: -w/8, y: -h/4};
  const upper_right = {x: w/8, y: -h/4};
  const lower_left = {x: -w/4, y: random(0.8, 1.6)*h/4};
  const lower_right = {x: w/4, y: random(0.8,1.1)*lower_left.y};
  let left_control_x = random(0,w/8);
  let left_control_y = upper_left.y;
  let right_control_x = random(-w/8, 0);

  const dress_path = [];
  //upper left
  dress_path.push({x:upper_left.x, y:upper_left.y});
  dress_path.push({x: left_control_x, y:left_control_y});
  dress_path.push({x:lower_left.x, y: lower_left.y});
  dress_path.push({x:lower_left.x, y: lower_left.y});
  //lower right
  dress_path.push({x:lower_left.x, y: lower_left.y});
  dress_path.push({x:lower_right.x, y:lower_right.y});
  dress_path.push({x:lower_right.x, y:lower_right.y});
  // upper right
  dress_path.push({x:lower_right.x, y:lower_right.y});
  dress_path.push({x: right_control_x, y: upper_right.y});
  dress_path.push({x: upper_right.x, y:upper_right.y});

  return dress_path
}

function draw_dress(){
  beginShape();
  for(let i=0; i<global_dress_path.length; i++){
    const pt = global_dress_path[i];
    if(i==0) vertex(pt.x, pt.y);
    else bezierVertex(pt.x, pt.y);
  }
  endShape(CLOSE);
}


function arms(num_lines, w, h){
  //arms and legs should use beizer curves with slightly varying control points to go from thin to thick to thin
  stroke("BLACK");
  //left arm, start on the outer edge
  let control_x, left_x;
  const left_y = random(-h*3/5, h/8);
  let stance;
  if(left_y > 0) stance = "on_hip";
  else if(left_y <-h/2) stance = "in_air";
  else stance = "out"
  if(stance == "on_hip"){ //arm on hip
    left_x = -w/8
    control_x = -h/2;
  } else if(stance == "in_air"){ //arm waving
    left_x = -w/8
    control_x = -h/2;
  } else if(stance == "out"){
    left_x = -w*0.4;
    control_x = left_x;
  }
  let control_y = left_y + random(-h/4,h/8);
  const left_body_x = -w/8;
  const left_body_y = -h/4;

  for(let i=0; i<num_lines; i++){
    bezier(left_x, left_y, control_x, control_y, left_body_x, left_body_y, left_body_x, left_body_y);
    control_y += limb_mult*h;
  }

  //right arm, start on the outer edge
  let right_x;
  const right_y = random(-h*3/5, h/8);
  if(left_y > 0) stance = "on_hip";
  else if(left_y <-h/2) stance = "in_air";
  else stance = "out"
  if(stance == "on_hip"){ //arm on hip
    right_x = w/8
    control_x = h/2;
  } else if(stance == "in_air"){ //arm waving
    right_x = w/8
    control_x = h/2;
  } else if(stance == "out"){
    right_x = w*0.4;
    control_x = right_x;
  }

  control_y = right_y + random(-h/4,h/8);
  const right_body_x = w/8;
  const right_body_y = -h/4;

  for(let i=0; i<num_lines; i++){
    bezier(right_x, right_y, control_x, control_y, right_body_x, right_body_y, right_body_x, right_body_y);
    control_y += limb_mult*h;
  }

}

function legs(num_lines, w, h){
  //arms and legs should use beizer curves with slightly varying control points to go from thin to thick to thin
  stroke("BLACK");
  //left leg, start on the outer edge
  let leg_x = random(-w/2,w/8);
  let leg_y = h/2;
  let control_x = leg_x + random(-w/4,w/4);
  let body_x = -w/16;
  let body_y = h/8;

  for(let i=0; i<num_lines; i++){
    bezier(leg_x, leg_y, control_x, leg_y, body_x, body_y, body_x, body_y);
    control_x += limb_mult*h;
  }

  //right leg, start on the outer edge
  leg_x = random(-w/8,w/2);
  leg_y = h/2;
  control_x = leg_x + random(-w/4,w/4);
  body_x = w/16;
  body_y = h/8;

  for(let i=0; i<num_lines; i++){
    bezier(leg_x, leg_y, control_x, leg_y, body_x, body_y, body_x, body_y);
    control_x += limb_mult*h;
  }

}

function perimeter_flair(){ //keith harring style shooting lines around person, centered

}

function curved_flair(x, y,){ //keith harring style movement lines

}

// HEAD --------------------------------------
function head(interval, w, h){
  push();
  stroke("BLACK")
  let head_w = random(0.6, 0.8)*w/8;
  let head_h = random(1,1.5)*head_w;
  let head_size = min(head_w, head_h);
  translate(head_size*random(-0.5,0.5), head_size*random(-0.25, 0.25));//random offset
  translate(0, -h*0.4); //normal head position
  translate(0, head_h/2); //go to bottom of head
  rotate(random(-20,20));
  translate(0, -head_h/2);
  while(head_size>0){
    push();
    ellipse(0,0, head_w, head_h);
    head_w -= interval;
    head_h -= interval;
    head_size -= interval;
    pop();
  }
  pop();
}
