'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [COTTONCANDY, SOUTHWEST];

function gui_values(){
  parameterize("points_per_line", floor(random(100, 500)), 1, 1000, 1, false);
  parameterize("amp", base_x/random(1,5), 0, base_x, 1, true);
  parameterize("i_damp", random(300, 1000), 1, 1000, 1, false);
  parameterize("number_of_lines", floor(random(100,500)), 3, 500, 1, false);
}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  png_bg(true);
  if(type == "png"){
    const stroke_c = random(working_palette);
    stroke(stroke_c);
    line_blur(stroke_c, 2*global_scale);
  }
  strokeWeight(1*global_scale);
  noFill();
  translate(canvas_x/2, 0);

  let lines_pts = [];
  for(let i=0; i<points_per_line; i++){
    lines_pts.push([]);
  }
  let line_id = 0;
  const y_step_size = canvas_y/points_per_line;

  //draw outer lines
  const starting_min_x = random(-canvas_x/3, -canvas_x/4);
  let ending_min_x;
  beginShape();
  for(let i=0; i<points_per_line; i++){
    const x = starting_min_x + map(noise((i+starting_min_x)/i_damp), 0,1, -amp, amp);
    let y = i*y_step_size;
    if(i+1 == points_per_line){
      ending_min_x = x;
      y = canvas_y;
    }
    vertex(x,y);
    lines_pts[i].push({id:line_id, x:x});
  }
  endShape();
  line_id++;

  const starting_max_x = random(canvas_x/4, canvas_x/3);
  let ending_max_x;
  beginShape();
  for(let i=0; i<points_per_line; i++){
    const x = starting_max_x + map(noise((i+starting_max_x)/i_damp), 0,1, -amp, amp);
    let y = i*y_step_size;
    if(i+1 == points_per_line){
      ending_max_x = x;
      y = canvas_y;
    }
    vertex(x,y);
    lines_pts[i].push({id:line_id, x:x});
  }
  endShape();
  line_id++;

  for(let j=0; j<number_of_lines-2; j++){
    let reverse = j%2 != 0;
    let starting_x = random(starting_min_x, starting_max_x);
    if(reverse){
      starting_x = random(ending_min_x, ending_max_x);
      lines_pts.reverse();
    }

    //determine which IDs are to the left, and which are to the right of this line
    const left_ids = [];
    const right_ids = [];

    beginShape();
    for(let i=0; i<points_per_line; i++){
      const x = starting_x + map(noise((i+starting_x)/i_damp), 0,1, -amp, amp);
      let y = i*y_step_size;
      if(reverse) y = canvas_y - i*y_step_size;

      //collision check
      let collision = false;
      for(let z=0; z<lines_pts[i].length; z++){
        const prev_id = lines_pts[i][z].id;
        const prev_x = lines_pts[i][z].x;

        //check if in neither column, and add it to one
        if(!left_ids.includes(prev_id) && !right_ids.includes(prev_id)){
          if(prev_x<=x) left_ids.push(prev_id);
          else right_ids.push(prev_id);
        }

        if((prev_x<=x && !left_ids.includes(prev_id)) || (prev_x>x && !right_ids.includes(prev_id))){
          vertex(prev_x,y);
          collision = true;
        }
      }

      if(collision) break;
      if(i+1==points_per_line){
        if(reverse) y = 0;
        else y = canvas_y;
      }
      vertex(x,y);
      lines_pts[i].push({id:line_id, x:x});
    }
    
    endShape();
    if(reverse) lines_pts.reverse();
    line_id++;
  }

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs

