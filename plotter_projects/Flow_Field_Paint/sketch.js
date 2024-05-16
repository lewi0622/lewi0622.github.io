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
  parameterize("brush_size", TRANSON_10, 0, 50, 0.1*96, true);
  console.log(brush_size);
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
  const stroke_c = color("BLACK");
  stroke_c.setAlpha(50);
  png_bg(true);
  const col_step = (canvas_x-x_margin*2)/cols;
  const row_step = (canvas_y-y_margin*2)/rows;
  translate(x_margin, y_margin);
  for(let k=0; k<cols; k++){
    for(let l=0; l<rows; l++){
      const pts = [{
        x:k*col_step, 
        y:l*row_step}];
      noFill();
      stroke("RED");
      strokeWeight(0.5*global_scale);
      circle(pts[0].x, pts[0].y, brush_size/2);

      strokeWeight(brush_size);
      stroke(stroke_c);

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