'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 30;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

function gui_values(){
  parameterize("total_x", 0, -base_x, base_x, 1, true);
  parameterize("total_y", 0, -base_y, base_y, 1, true);
  parameterize("angle_steps", 360, 1, 360, 1, false);
  parameterize("x_damp", 1, 0.1, 10, 0.1, false);
  parameterize("y_damp", 1, 0.1, 10, 0.1, false);
  parameterize("my_radius", 2.5, -20, 20, 0.1, true);
  parameterize("num_thetas", 5, 1, 20, 1, false);
  parameterize("shape_x", 0, -base_x/2, base_x/2, 1, true);
  parameterize("shape_y", 0, -base_y/2, base_y/2, 1, true);
  parameterize("rotation", 0, 0, 360, 1, false);
  parameterize("rad_lerp", 0.06, 0, 0.5, 0.01, false);
  parameterize("rad_start_pct", 1.07, -5, 5, 0.01, false);
}

function setup() {
  common_setup(16.5*96/4, 22.5*96/4);
  gui_values();
  noFill();
}
//***************************************************
function draw() {
  global_draw_start();

  push();
  translate(total_x, total_y);

  const scale_factor = 96/4*global_scale

  const sm_min_radius = 7.5*scale_factor/2;
  const lg_min_radius = 10.5*scale_factor/2;

  const sm_max_radius = canvas_x;
  const lg_max_radius = canvas_y;


  translate(shape_x, shape_y);

  translate(canvas_x/2 ,canvas_y/2);
  rotate(rotation);
  const angle_step_size = 360 / angle_steps;

  const theta_mults = [];
  const theta_offsets = [];
  for(let i=0; i<num_thetas; i++){
    theta_mults.push(floor(random(1,10)));
    theta_offsets.push(random(360));
  }

  let pt_45, pt_135, pt_225, pt_315
  const pts = [];

  let min_radius = sm_min_radius * rad_start_pct;
  let radius = min_radius;
  for(let i=0; i<angle_steps; i++){
    const theta = i * angle_step_size;
    let min_radius;
    if(theta <90) min_radius = lerp(sm_min_radius, lg_min_radius, theta/90);
    else if (theta < 180) min_radius = lerp(lg_min_radius, sm_min_radius, (theta-90)/90);
    else if (theta < 270) min_radius = lerp(sm_min_radius, lg_min_radius, (theta-180)/90);
    else min_radius = lerp(lg_min_radius, sm_min_radius, (theta-270)/90);

    radius = lerp(radius, min_radius, rad_lerp);

    for(let j=0; j<theta_mults.length; j++){
      radius += map(sin(theta * theta_mults[j] + theta_offsets[j]), -1,1, 0, lerp(my_radius, 0, j/theta_mults.length));
    }
    const x = radius * cos(theta);
    const y = radius * sin(theta);
    const pt = {x:x, y:y};
    pts.push(pt);

    // if(i == 0) circle(x,y,100)

    if(theta == 45) pt_45 = pt;
    else if(theta == 135) pt_135 = pt;
    else if(theta == 225) pt_225 = pt;
    else if(theta == 315) pt_315 = pt;
  }

  beginShape();
  for(let i=0; i<pts.length; i++){
    const pt = pts[i];
    vertex(pt.x, pt.y);
  }
  endShape(CLOSE);

  //corners
  line()

  pop();

  push();
  translate(total_x, total_y);
  translate(canvas_x/2, canvas_y/2);
  rectMode(CENTER);
  stroke("BLUE");
  if(type == "png"){
    rect(0,0,9*scale_factor, 12*scale_factor); //page
    stroke("RED");
    rect(4*scale_factor,0, 0.5*scale_factor, 11*scale_factor); //right bar
    rect(-4*scale_factor,0, 0.5*scale_factor, 11*scale_factor); //left bar
  }

  stroke("BLACK")
  rect(0,0, 7.5*scale_factor, 10.5*scale_factor);

  pop();  
  
  global_draw_end();
}
//***************************************************
//custom funcs