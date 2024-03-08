'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

let x_fourth, y_fourth, copic_palette;
const suggested_palettes = []

function gui_values(){
  parameterize("num_lines", floor(random(50,300)), 1, 500, 1, false);
  parameterize("radius", canvas_x/2, 1, 1000, 5, true);
  parameterize("pct_variation", random(0.15), 0, 1, 0.01, false);
  parameterize("pct_line_skip", random(0.15), 0, 1, 0.01, false);
  parameterize("corner_radius", random(0.1), 0, 1, 0.01, false);
} 

function setup() {
  common_setup(8*96, 8*96);
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();

  //actual drawing stuff
  push();

  center_rotate(random([0,90,180,270]));
  translate((canvas_x-radius)/2, (canvas_y-radius)/2);
  strokeWeight(2*global_scale);

  for(let i=0; i<num_lines; i++){
    if(random()<pct_line_skip) continue;

    stroke(random(working_palette));
    let x,y;
    let variation = random(-pct_variation*0.25, pct_variation) *radius*2* random([0,1]) 
    if(i/num_lines<=0.5){
      x = 0;
      y = lerp(0,radius,i/num_lines*2);
    }
    else{
      x = lerp(radius,0,(1-i/num_lines)*2);
      y = radius;
    }
    let pt1 = {x: x+variation, y: y-variation};
    let pt2 = {x: y+variation, y: x-variation};
    let original_pt_dist = dist(pt1.x, pt1.y, pt2.x, pt2.y);
    let original_pt_sign = Math.sign(pt2.y-pt1.y);
    if(original_pt_dist==0) continue;
    
    let amt =0;
    if(i/num_lines<corner_radius/2){ //upper left corner
      const pct = map(i/num_lines, 0, corner_radius/2, 0, 1);

      amt = lerp(radius*corner_radius/4, 0, pct);
      amt = pow(amt, 1.5);
    }
    else if(i/num_lines>0.5-corner_radius/2 && i/num_lines<0.5){ ///inside corner
      const pct = map(i/num_lines, 0.5-corner_radius/2, 0.5, 0,1)
      amt = lerp(0, radius*corner_radius/4, pow(pct,2));
    }
    else if(i/num_lines>=0.5 && i/num_lines<0.5+corner_radius/2){
      const pct = map(i/num_lines, 0.5, 0.5+corner_radius/2, 1,0)
      amt = lerp(0, radius*corner_radius/4, pow(pct,2));
    }
    else if((1-i/num_lines)<corner_radius/2){ //lower right corner
      const pct = map(i/num_lines, 1-corner_radius/2, 1, 0, 1);
      amt = lerp(0,radius*corner_radius/2, pct);
      amt = pow(amt,1.5);
    }

    pt1.x += amt;
    pt1.y -= amt;
    pt2.x -= amt;
    pt2.y += amt;

    if(original_pt_dist<dist(pt1.x, pt1.y, pt2.x, pt2.y)) continue;
    if(original_pt_sign != Math.sign(pt2.y-pt1.y)) continue;
    line(pt1.x, pt1.y, pt2.x, pt2.y);
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
