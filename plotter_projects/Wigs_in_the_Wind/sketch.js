'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 20;

const suggested_palettes = [SAGEANDCITRUS, BIRDSOFPARADISE];

function gui_values(){
  parameterize("num_points", random(100, 500), 1, 720, 1, false);
  parameterize("radius_start", smaller_base/3.75, 0, smaller_base, 1, true);
  parameterize("radius_end", smaller_base/4, 0, smaller_base, 1, true);
  parameterize("radius_step_size", 1, 0, 20, 0.1, true);
  parameterize("rings", 3, 1, 10, 1, false);
  // parameterize("iterations", floor(random(30,100)), 1, 500, 1, false);
  parameterize("step_size", 1, 1, 50, 1, true);
  const damp = random(200, 2000);
  parameterize("x_damp", damp, 1, 10000, 1, false);
  parameterize("y_damp", damp, 1, 10000, 1, false);
  parameterize("i_damp", random(500, 1000), 1, 10000, 1, false);
  parameterize("num_colors", round(random(1, working_palette.length-1)), 1, working_palette.length-1, 1, false);
}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();
  refresh_working_palette();
  push();
  noFill();
  strokeWeight(1*global_scale);
  png_bg(true);
  working_palette = controlled_shuffle(working_palette, true);
  const colors = [];
  for(let i=0; i<num_colors; i++){
    colors.push(color(working_palette[i]));
    colors[i].setAlpha(200);
  }

  translate(canvas_x/2, canvas_y/2);

  const ang_step = 360/num_points;
  for(let k=0; k<rings; k++){
    let radius = lerp(radius_start, radius_end, k/rings);
    for(let j=0; j<num_points; j++){
      const theta = j*ang_step;
      if(theta>30 && theta <150) continue;
      if(theta>320 && theta<340) radius -= radius_step_size;
      else if(theta>200 && theta<220) radius += radius_step_size;
      const stroke_c = random(colors);
      stroke(stroke_c);
      if(type == "png"){
        line_blur(stroke_c, 2*global_scale);
      }
      const pts = [{
        x:random(0.99,1.01)*radius * cos(theta), 
        y:random(0.99,1.01)*radius * sin(theta)}];
  
      const iterations = floor(random(30, 200));
      beginShape();
      for(let i=0; i<iterations; i++){
        const starting_pt = pts[i];
    
        vertex(starting_pt.x, starting_pt.y);
    
        let angle = noise(starting_pt.x/global_scale/x_damp, starting_pt.y/global_scale/y_damp, i/i_damp) * 360*2;
        pts.push({
          x: starting_pt.x + step_size * cos(angle),
          y: starting_pt.y + step_size * sin(angle)
        });
      }
      endShape();
    }
  }
  pop();
  
  global_draw_end();
}
//***************************************************
//custom funcs