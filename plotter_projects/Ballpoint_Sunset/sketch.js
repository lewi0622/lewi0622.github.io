'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 5;
const capture = false;
const capture_time = 50/fr;

const suggested_palettes = [];
let sun, water;
function gui_values(){
  parameterize("radius", base_x/4, 0, base_x/2, 1, true);
  parameterize("shape_max_height", base_y/4, 0, base_y/2, 1, true);
  parameterize("num_trees", floor(random(20, 50)), 1, 100, 1, false);
  parameterize("hatch_steps", floor(random(50, 200)), 1, 500, 1, false);
}

function setup() {
  common_setup();
  gui_values();
  noFill();
}
//***************************************************
function draw() {
  global_draw_start();
  push();
  if(type=="png") clip(mask)
  center_rotate(180);
  sun = color("RED");
  sun.setAlpha(120);
  water = color("BLACK");
  water.setAlpha(120);
  stroke(water);
  const shape_width = canvas_x / 2;
  const x_step = shape_width/(num_trees-1);

  translate(canvas_x/2, canvas_y/2);
  for(let i=0; i<num_trees; i++){
    if(i == 0 || i == num_trees-1) continue;
    push();
    const x = i * x_step - shape_width/2;
    const theta = acos(x/radius);
    const y = radius * sin(theta);
    translate(x,y);
    // rotate(random(-10,10));
    const end_y = map(noise(i/5), 0,1, shape_max_height/4, shape_max_height*1.5);
    // line(0,0,0, -y-end_y);
    hatch(0, random(0.75,1.1) * (-y-end_y), hatch_steps, x, y); 
    pop();
  }

  pop();
  if(type=="svg") mask();
  global_draw_end();
}
//***************************************************
//custom funcs
function hatch(end_x, end_y, steps, x_offset, y_offset){
  //lerp from A->B and horizontal or cross hatch
  const hatch_width =canvas_x/50;
  let x = 0;
  let y = 0;
  const x_step = end_x / steps;
  const y_step = end_y / steps;

  for(let i=0; i<steps; i++){
    push();
    x += x_step;
    if(abs(x+x_offset)/radius<0.25){
      stroke(sun);
    }
    if(i/steps < 0.5){
      y += y_step/3;
    }
    else if(i/steps <0.75) y += y_step;
    else y += y_step * 3;
    translate(x,y);
    rotate(random([180,0]));
    translate(-hatch_width/2, 0);
    if((y+y_offset)/shape_max_height>0){
      stroke(sun);
      squiggle(5, hatch_width, hatch_width, i);
    }
    else squiggle(5, lerp(hatch_width*8, hatch_width/4, map(i/steps, 0.5,1, 0, 1)), hatch_width, i);
    pop();
  }
}

function squiggle(steps, h_amp, v_amp, j) {
  curveTightness(random([-5, -5, 0, 5, 5]));
  beginShape();
  for (let i = 0; i < steps; i++) {
    const l_r = random([-1, 1, 1]) * h_amp;
    const u_d = random([-1, 1]) * v_amp;
    curveVertex(i * random(h_amp) + noise(i, j) * l_r, noise(i, j) * u_d);
  }
  endShape();
}

function mask(){
  push();
  center_rotate(180);
  translate(canvas_x/2, canvas_y/2);
  stroke("TEAL");
  const steps = 100;
  const angle_step = 180/steps;
  beginShape();
  vertex(canvas_x, -canvas_y/2);
  vertex(canvas_x,canvas_y/2);
  for(let i=0; i<steps; i++){
    const x = radius*cos(i * angle_step);
    const y = radius*sin(i * angle_step);
    vertex(x,y);
  }
  vertex(-canvas_x, canvas_y/2);
  vertex(-canvas_x, -canvas_y/2);
  endShape(CLOSE);
  pop();
}