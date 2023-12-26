'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 10;
let pts, stroke_c, bg_c, curved;
let main = 0;
let sec = 0;
suggested_palettes = [TOYBLOCKS];

function gui_values(){
  parameterize("main_rad", random(10,150), 1, 300, 5, true);
  parameterize("sec_rad", random(10,150), 1, 300, 5, true);
  parameterize("main_theta_per_loop", random(1,50), 0.01, 100, 0.01, false);
  parameterize("sec_theta_per_loop", random(1,50), 0.01, 100, 0.01, false);
  parameterize("loops_per_frame", 10, 1, 50, 1, false);
}

function setup() {
  common_setup();
  pts = [];
  bg_c = random(working_palette);
  reduce_array(working_palette, bg_c)
  stroke_c = random(working_palette);
  stroke(stroke_c);
  curved = round(random());
  noFill();
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();

  //actual drawing stuff
  push();
  background(bg_c);

  for(let i=0; i<loops_per_frame; i++){
    let x = canvas_x/2;
    let y = canvas_y/2;
  
    //main
    x += main_rad * cos(main);
    y += main_rad * sin(main);
    //sec
    x += sec_rad * cos(sec);
    y += sec_rad * sin(sec);
  
    pts.push({x:x, y:y});
  
    main += main_theta_per_loop;
    sec += sec_theta_per_loop;
  }

  beginShape();
  pts.forEach(pt => {
    if(curved) curveVertex(pt.x, pt.y);
    else vertex(pt.x, pt.y);
  });
  endShape();

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs



