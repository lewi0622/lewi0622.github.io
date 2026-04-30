'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 30;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

function gui_values(){
  parameterize("angle_steps", 360, 1, 360, 1, false);
  parameterize("min_radius", base_x/3, 0, base_x, 1, true);
  parameterize("x_damp", 1, 0.1, 10, 0.1, false);
  parameterize("y_damp", 1, 0.1, 10, 0.1, false);
  parameterize("num_thetas", 5, 1, 20, 1, false);
  parameterize("shape_x", 0, -base_x/2, base_x/2, 1, true);
  parameterize("shape_y", 0, -base_y/2, base_y/2, 1, true);
}

function setup() {
  common_setup(24*96, 30*96);
  gui_values();
  noFill();
}
//***************************************************
function draw() {
  global_draw_start();

  push();
  translate(shape_x, shape_y);

  translate(canvas_x/2 ,canvas_y/2);
  const angle_step_size = 360 / angle_steps;
  // rotate(random(360));

  const theta_mults = [];
  const theta_offsets = [];
  for(let i=0; i<num_thetas; i++){
    theta_mults.push(floor(random(1,10)));
    theta_offsets.push(random(360));
  }

  let pt_45, pt_135, pt_225, pt_315
  const pts = []
  for(let i=0; i<angle_steps; i++){
    const theta = 45 + i * angle_step_size;
    let radius = min_radius
    for(let j=0; j<theta_mults.length; j++){
      radius += map(sin(theta * theta_mults[j] + theta_offsets[j]), -1,1, 0, lerp(canvas_x/8, 0, j/theta_mults.length));
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
  translate(canvas_x/2, canvas_y/2);
  rectMode(CENTER);
  stroke("RED");
  rect(0,0, 9*96, 12*96);
  stroke("BLACK")
  rect(0,0, 8*96, 11*96);

  pop();  
  
  global_draw_end();
}
//***************************************************
//custom funcs