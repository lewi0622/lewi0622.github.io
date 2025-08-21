'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 30;
const capture = false;
const capture_time = 10;

const suggested_palettes = [BIRDSOFPARADISE, SUMMERTIME];
const CARDINALS = [0,90,180,270];

function gui_values(){
  const division = random(2,4);
  const col_division = random([division*2, division, division, division]);
  const row_division = random([division*2, division, division, division]);
  parameterize("cols", floor(base_x/col_division), 1, base_x, 1, false);
  parameterize("rows", floor(base_y/row_division), 1, base_y, 1, false);
  parameterize("x_margin", -base_x/2, -base_x/2, base_x/2, 1, true);
  parameterize("y_margin", -base_y/2, -base_y/2, base_y/2, 1, true);
  parameterize("iterations", 2, 1, 100, 1, false);
  parameterize("step_size", smaller_base/4, 1, smaller_base, 1, true);
  const damp = random(100, 500);
  parameterize("x_damp", damp, 1, 1000, 1, false);
  parameterize("y_damp", damp, 1, 1000, 1, false);
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
  strokeWeight(BICCRISTAL*global_scale);
  working_palette = controlled_shuffle(working_palette, true);
  const black_color = color("BLACK");
  black_color.setAlpha(BICCRISTAL_ALPHA);
  stroke(black_color);
  const col_step = (canvas_x-x_margin*2)/cols;
  const row_step = (canvas_y-y_margin*2)/rows;
  translate(x_margin, y_margin);

  const lines = [];
  for(let k=0; k<cols; k++){
    for(let l=0; l<rows; l++){
      const starting_pt = {
        x:k*col_step, 
        y:l*row_step
      };
      const pts = [starting_pt];
      for(let i=0; i<iterations; i++){
        const starting_pt = pts[i];
        let angle, reverse_angle;
        if(simplex){
          angle = pnoise.simplex2(starting_pt.x/global_scale/x_damp, starting_pt.y/global_scale/y_damp) * 90;
        }
        else{
          angle = noise(starting_pt.x/global_scale/x_damp, starting_pt.y/global_scale/y_damp) * 180;
        }
        const angle_constraint = 15;
        angle = round(angle/angle_constraint)*angle_constraint;

        if(CARDINALS.includes(angle)){
          const noise_val = round(noise(starting_pt.x/global_scale/x_damp, starting_pt.y/global_scale/y_damp));
          if(noise_val == 0) angle += angle_constraint;
          else angle -= angle_constraint;
        }
        pts.push({
          x: starting_pt.x + step_size * cos(angle),
          y: starting_pt.y + step_size * sin(angle)
        });
      }
      lines.push(pts)
    }
  }

  for(let j=0; j<lines.length; j++){
    const all_pts = lines[j];
    beginShape();
    for(let i=0; i<all_pts.length; i++){
      const pt = all_pts[i];
      vertex(pt.x, pt.y);
    }
    endShape();
  }


  pop();
  
  global_draw_end();
}
//***************************************************
//custom funcs