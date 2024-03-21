'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 10;
let pts, stroke_c, bg_c, curved;
let paused = false;
let main = 0;
let sec = 0;
const suggested_palettes = [SIXTIES, TOYBLOCKS];

function gui_values(){
  parameterize("main_rad", random(10,150), 1, 300, 5, true);
  parameterize("sec_rad", random(10,150), 1, 300, 5, true);
  parameterize("main_theta_per_loop", random(1,50), 1, 100, 0.25, false);
  parameterize("sec_theta_per_loop", random(1,50), 1, 100, 0.25, false);
  parameterize("loops_per_frame", 10, 1, 50, 1, false);
  parameterize("glow", 1, 0, 1, 1, false);
}

function setup() {
  common_setup();
  gui_values();
  pts = [];
  bg_c = random(working_palette);
  reduce_array(working_palette, bg_c)
  stroke_c = random(working_palette);
  stroke(stroke_c);
  curved = round(random());
  noFill();
  paused = false;
  if(document.getElementById("pt_slider") !=null)document.getElementById("pt_slider").remove();
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();

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

  draw_pts();

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
function draw_pts(pt_length){
  if(frameCount/fr > 7) randomize_seed();
  
  if(type == "png") background(bg_c);

  if(glow){
    drawingContext.shadowColor = color(stroke_c);
    drawingContext.shadowBlur = 3*global_scale;
  }

  beginShape();
  let iterations;
  if(pt_length != undefined) iterations = pt_length;
  else iterations = pts.length;
  for(let i=0; i<iterations; i++){
    const pt = pts[i];
    if(curved) curveVertex(pt.x, pt.y);
    else vertex(pt.x, pt.y);
  }
  endShape();
}


function keyPressed(){
  if(keyCode == 70){ //70 is keycode F
    if(paused){
      loop();
      document.getElementById("pt_slider").remove();
    }
    else{
      noLoop();
      const pt_slider = createSlider(0, pts.length, pts.length, 1);
      pt_slider.position(canvas_x/2, canvas_y/2);
      pt_slider.changed(()=>{
        clear();
        draw_pts(pt_slider.value());
      });
      pt_slider.id("pt_slider");
    }
    paused = !paused;
  }
}

