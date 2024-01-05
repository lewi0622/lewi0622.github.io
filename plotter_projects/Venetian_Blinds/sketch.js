'use strict';

//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [SOUTHWEST, NURSERY];

function gui_values(){
  parameterize("weight", random(6,20), 0.1, 50, 0.1, true);
  parameterize("opacity", random(60,150), 0, 255, 1, false);
  parameterize("line_steps", random(25,75), 1, 500, 1, false);
  parameterize('number_of_lines', random(30, 100), 1, 500, 1, false);
  parameterize("x_offset", 0, -100, 100, 1, true);
  parameterize("y_offset", 0, -100, 100, 1, true);
  parameterize("x_noise_amp", 1350, 0, 500, 1, true);
  parameterize("x_noise_damp", 135, 1, 1000, 1, false);
}

function setup() {
  common_setup(8.5*96, 11*96, SVG);
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  noFill();
  // blendMode(MULTIPLY)//multiply HARD_LIGHT BURN
  // const bg_c = random(working_palette);
  // reduce_array(working_palette, bg_c);
  // background(bg_c);
  

  for(let z=0; z<1; z++){
    push();
    center_rotate(180*z);
    translate(x_offset, y_offset);
    let c = color(random(working_palette));
    c.setAlpha(opacity);
    stroke(c);

    strokeWeight(weight);
    const start_line_pts = [];
    const end_line_pts = [];
    const line_step_size = canvas_y*1.5/line_steps;
    
    const start_noise_offset = random(0,200)
    const end_noise_offset = random(200, 400);
    translate(canvas_x/8,-canvas_y*0.25)
    for(let i=0; i<line_steps; i++){
      //start is on the left side
      const start_x = map(noise(start_noise_offset + i/x_noise_damp), 0,1, -x_noise_amp,x_noise_amp);
      const start_y = i*line_step_size;
      start_line_pts.push({x:start_x, y:start_y}); //define start points
      //end is on the right side
      const end_x = canvas_x + map(noise(end_noise_offset+ i/x_noise_damp), 0,1, -x_noise_amp,x_noise_amp);
      const end_y = start_y;
      end_line_pts.push({x:end_x, y:end_y}); //define end points
    }
    const current_line_pts = JSON.parse(JSON.stringify(start_line_pts)); //copy start pts for current pts
    for(let i=0; i<number_of_lines; i++){
      beginShape();
      for(let j=0; j<line_steps; j++){
        const start = start_line_pts[j];
        const current = current_line_pts[j];
        const end = end_line_pts[j];
        let new_x = lerp(start.x, end.x, i/number_of_lines);
        let new_y = lerp(start.y, end.y, i/number_of_lines);
        
        new_x = constrain(new_x, current.x-weight, current.x+weight);
        new_y = constrain(new_y, current.y-weight, current.y+weight);
        
        vertex(new_x, new_y);
        current_line_pts[j] = {x:new_x, y:new_y}; //overwrite current value
      }
      endShape();
    }
    pop();
  }
  pop();

  global_draw_end();
}
//***************************************************
//custom funcs