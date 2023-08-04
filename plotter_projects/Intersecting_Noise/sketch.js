'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
suggested_palettes = [LASER]


function gui_values(){
  parameterize("points_per_line", 500, 1, 500, 1, false);
  parameterize("amp", 100, 0, 1000, 1, true);
  parameterize("i_damp", random(200, 1000), 1, 1000, 1, false);
  parameterize("j_boost", random(1,100), 1, 100, 1, false);
  parameterize("number_of_lines", floor(random(20, 100)), 1, 500, 1, false);
  parameterize("offset", 0, 0, 50, 0.1, true);
  parameterize("z_iterations", 1, 1, 7, 1, false);
  parameterize("z_damp", 1, 1, 100, 1, false);
}

function setup() {
  common_setup(11*96, 8.5*96, SVG);
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  noFill();
  translate(canvas_x/2, 0);
  const i_offset = random(-200, 500);
  for(let z=0; z<z_iterations; z++){
    let c = color(working_palette[z]);
    c.setAlpha(150);
    stroke(c);
    const x_min = [];
    const x_max = [];
    const y_step_size = canvas_y/points_per_line;

    
    let x_offset = 0;
    let dir, rev;
    for(let j=0; j<number_of_lines; j++){
      if(j != 0){
        if((j-1)%4==0 || (j-2)%4==0) dir = 1;
        else dir = -1;

        if((j-2)%4==0 || (j-3)%4==0) rev = 1;
        else rev = 0;
      }
      else{ // if first loop, special case
        dir = 1;
        rev = 0;
      }
      beginShape();
      if(rev == 0){
        if(j != 0){
          if(dir == -1) x_offset = x_min[0] - offset;
          else x_offset = x_max[0] + offset;
        }

        for(let i=0; i<points_per_line; i++){
          const x = x_offset + map(noise((i + i_offset)/i_damp, j*j_boost, (z+1)/z_damp), 0,1, -amp, amp);
          const y = i*y_step_size;
          if(j==0){
            x_min[i] = x;
            x_max[i] = x;
          }
          else if(dir == 1 && x<x_max[i]){
            vertex(x_max[i], y);
            break;
          }
          else if(dir == -1 && x>x_min[i]){
            vertex(x_min[i], y);
            break;
          }
    
          vertex(x,y);
    
          if(x>x_max[i]) x_max[i] = x;
          if(x<x_min[i]) x_min[i] = x;
    
        }
      }
      else{
        x_min.reverse();
        x_max.reverse();
        if(dir == -1) x_offset = x_min[0] - offset;
        else x_offset = x_max[0] + offset;

        for(let i=0; i<points_per_line; i++){
          const x = x_offset + map(noise((i + i_offset)/i_damp, j*j_boost, (z+1)/z_damp), 0,1, -amp, amp);
          const y = canvas_y - i*y_step_size;
          if(j==0){
            x_min[i] = x;
            x_max[i] = x;
          }
          else if(dir == 1 && x<x_max[i]){
            vertex(x_max[i], y);
            break;
          }
          else if(dir == -1 && x>x_min[i]){
            vertex(x_min[i], y);
            break;
          }
    
          vertex(x,y);
    
          if(x>x_max[i]) x_max[i] = x;
          if(x<x_min[i]) x_min[i] = x;
    
        }
        x_min.reverse();
        x_max.reverse();
      }
      
      endShape();
    }
  }
  pop();

  global_draw_end();
}
//***************************************************
//custom funcs

