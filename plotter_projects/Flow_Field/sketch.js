'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 30;
const capture = false;
const capture_time = 10;

const suggested_palettes = [BIRDSOFPARADISE, SUMMERTIME];

function gui_values(){
  const division = random(4,10);
  const col_division = random([division*2, division, division, division]);
  const row_division = random([division*2, division, division, division]);
  parameterize("cols", floor(base_x/col_division), 1, base_x, 1, false);
  parameterize("rows", floor(base_y/row_division), 1, base_y, 1, false);
  parameterize("x_margin", -base_x/16, -base_x/2, base_x/2, 1, true);
  parameterize("y_margin", -base_y/16, -base_y/2, base_y/2, 1, true);
  parameterize("iterations", floor(random(30,100)), 1, 500, 1, false);
  parameterize("step_size", random(1,10), 1, 50, 1, true);
  const damp = random(200, 2000);
  parameterize("x_damp", damp, 1, 10000, 1, false);
  parameterize("y_damp", damp, 1, 10000, 1, false);
  parameterize("i_damp", random(100,1000), 1, 1000, 1, false);
  parameterize("num_colors", round(random(1, working_palette.length-1)), 1, working_palette.length-1, 1, false);
  parameterize("simplex", round(random()), 0, 1, 1, false);
}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();

  push();
  noFill();
  strokeWeight(1*global_scale);
  png_bg(true);
  const colors = [];
  for(let i=0; i<num_colors; i++){
    colors.push(color(working_palette[i]));
    colors[i].setAlpha(150);
  }
  const col_step = (canvas_x-x_margin*2)/cols;
  const row_step = (canvas_y-y_margin*2)/rows;
  translate(x_margin, y_margin);
  for(let k=0; k<cols; k++){
    for(let l=0; l<rows; l++){
      const stroke_c = random(colors);
      stroke(stroke_c);
      if(type == "png"){
        line_blur(stroke_c, 2*global_scale);
      }
      const pts = [{
        x:k*col_step, 
        y:l*row_step}];
      beginShape();
      for(let i=0; i<iterations; i++){
        const starting_pt = pts[i];
    
        curveVertex(starting_pt.x, starting_pt.y);
        let angle;
        if(simplex){
          angle = pnoise.simplex3(starting_pt.x/global_scale/x_damp, starting_pt.y/global_scale/y_damp, i/i_damp) * 360*5;
        }
        else{
          angle = noise(starting_pt.x/global_scale/x_damp, starting_pt.y/global_scale/y_damp, i/i_damp) * 360*5;
        }

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