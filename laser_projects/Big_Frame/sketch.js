'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 30;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

function gui_values(){
  parameterize("pt_offset_pct", 0.1, 0, 0.5, 0.01, false);
  parameterize("inner_pt_offset_pct", 0.5, 0, 1, 0.01, false);
  parameterize("step_size", 40, 1, 100, 1, false);
  parameterize("noise_radius", 8, 1, 100, 1, false);
  parameterize("noise_amp", 100, 0, 100, 1, true);
  parameterize("angle_damp", 1, 1, 200, 1, false);
}

function setup() {
  common_setup(6*96, 8*96); //multiply by 4 to get actual size
  gui_values();
  noFill();
}
//***************************************************
function draw() {
  global_draw_start();

  // png_bg(true);
  push();
  
  const scale_factor = 96*global_scale/4;

  outline(pt_offset_pct);

  translate(canvas_x/2, canvas_y/2);
  rectMode(CENTER);


  if(type=="png"){
    stroke("BLUE")
    rect(0,0,18*scale_factor, 24*scale_factor); //18x24 paper
    stroke("RED");
    rect(-17/2*scale_factor, 0, 0.5*scale_factor, 23*scale_factor) //36x48 frame
    rect(17/2*scale_factor, 0, 0.5*scale_factor, 23*scale_factor) //36x48 frame
  }

  stroke("BLACK")
  rect(0,0, 16.5*scale_factor, 22.5*scale_factor, 0.25*scale_factor);

  pop();  
  
  global_draw_end();
}
//***************************************************
//custom funcs
function outline(offset_pct){
  const TR_pt = {x:canvas_x * (1-offset_pct), y:canvas_y * offset_pct};
  const BR_pt = {x:canvas_x * (1-offset_pct), y:canvas_y * (1-offset_pct)};  
  const BL_pt = {x:canvas_x * offset_pct, y:canvas_y * (1-offset_pct)};
  const TL_pt = {x:canvas_x * offset_pct, y:canvas_y * offset_pct};

  beginShape();
  a_to_b(TR_pt, BR_pt, 360);
  corner(BR_pt, 0)
  a_to_b(BR_pt, BL_pt, 450);
  corner(BL_pt, 90)
  a_to_b(BL_pt, TL_pt, 540);
  corner(TL_pt, 180)
  a_to_b(TL_pt, TR_pt, 630);
  corner(TR_pt, 270)
  endShape(CLOSE);
}


function a_to_b(a, b, angle){
  const a_b_dist = dist(a.x, a.y, b.x, b.y);
  const num_steps = floor(a_b_dist / step_size);

  for(let i=0; i<num_steps; i++){
    //rect_pt
    const x = lerp(a.x, b.x, i/num_steps);
    const y = lerp(a.y, b.y, i/num_steps);

    const amp = get_amp(x,y, angle);

    vert_pt(x,y, angle, amp);
  }

}

function vert_pt(x,y, angle, amp){
    const offset_x = amp * cos(angle);
    const offset_y = amp * sin(angle);
    curveVertex(x + offset_x, y + offset_y);
}

function get_amp(x,y, angle){
    const relative_x = canvas_x/2 - x;
    const relative_y = canvas_y/2 - y;

    // const radius = sqrt(x*x + y*y);
    const theta = atan2(relative_y, relative_x);
    
    const xoff = map(cos(theta), -1,1, 0, noise_radius); //noise is symmetrical about the 0 axis, so we need to move from -1,1 fully into the positive realm
    const yoff = map(sin(theta), -1,1, 0, noise_radius);

    return noise_amp * noise(xoff, yoff, angle/angle_damp);
}


function corner(pt,starting_angle, steps=4){
  const angle_step = 90/steps;
  for(let i=1; i<steps; i++){
    const angle = i * angle_step + starting_angle;
    const amp = get_amp(pt.x, pt.y, angle);
    vert_pt(pt.x, pt.y, angle, amp);
  }
}