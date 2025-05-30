'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 20;

const suggested_palettes = [BUMBLEBEE, SUMMERTIME, SOUTHWEST, JAZZCUP];

function gui_values(){
  parameterize("line_segments", floor(random(10,base_x/10)), 3, base_x/4, 1, false); 
  parameterize("number_of_lines", floor(random(1,2)*base_x), 10, base_x*3, 10, false); //standard lines for fineline: 353; standard lines for angled pitt pen: 115?
  parameterize("x_amp", base_x/4, 1, base_x, 1, true);
  parameterize("y_amp", base_y/6.5, 1, base_y, 1, true);
  parameterize("x_i_damp", random(base_x/4, base_x*2), 1, base_x*2, 1, true);
  parameterize("x_j_damp", base_x/random(1,4), 1, base_x*2, 1, true);
  parameterize("y_i_damp", random(1,base_y/4), 1, base_y*2, 1, true);
  parameterize("y_j_damp", random(base_y/4,base_y*2), 1, base_y*2, 1, true);
  parameterize("y_sin_amp", random(base_y), 0, base_x, 1, true);
  parameterize("sin_range", random(180), 0, 720, 1, false);
  parameterize("rotate_per_line", random(-0.003, 0.003), -0.1, 0.1, 0.001, false);
  parameterize("x_move", 0, -base_x, base_x, 1, true);
  parameterize("y_move", 0, -base_y, base_y, 1, true);
  parameterize("margin_x", base_x/2, -base_x/2, base_x, 1, true);
  parameterize("margin_y", base_y/4, -base_y/2, base_y/2, 1, true);
  parameterize("orb_size", smaller_base/2, 0, larger_base, 1, true);
  parameterize("skip_chance", random([0,0.1]), 0, 1, 0.01, false);
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
  refresh_working_palette();
  png_bg();
  const stroke_c = random(working_palette);
  stroke(50);
  circle(random(orb_size/2, canvas_x-orb_size/2),orb_size/2, random(orb_size/2, orb_size));

  if(type == "png") stroke(stroke_c);
  else stroke("black");
  strokeWeight(0.5*global_scale);
  strokeWeight(LEPEN*global_scale);
  translate(x_move, y_move);
  const y_theta_offset = random(360);
  // noFill();
  const segment_step_size = (canvas_x+margin_x*2)/line_segments;
  const line_step_size = (canvas_y+margin_y*2)/number_of_lines;
  let min_x = canvas_x;
  let max_x = 0;
  let min_y = canvas_y;
  let max_y = 0;
  const lines = [];
  for(let j=0; j<number_of_lines; j++){
    const pts = [];
    const y_base_loc = j*line_step_size;
    for(let i=0; i<line_segments; i++){
      const x_loc = i*segment_step_size;
      const y_loc = y_base_loc + y_sin_amp * sin(y_theta_offset + map(i/line_segments, 0,1, 0, sin_range));
      // const x = x_loc + map(noise(x_loc/x_i_damp, y_loc/x_j_damp), 0,1, -x_amp, x_amp);
      // const y = y_loc + map(noise(x_loc/y_i_damp, y_loc/y_j_damp), 0,1, -y_amp, y_amp);
      const x = x_loc + map(pnoise.simplex2(x_loc/x_i_damp, y_loc/x_j_damp), -1,1, -x_amp, x_amp);
      const y = y_loc + map(pnoise.simplex2(x_loc/y_i_damp, y_loc/y_j_damp), -1,1, -y_amp, y_amp);
      pts.push([x,y]);

      if(x<min_x) min_x = x;
      if(x>max_x) max_x = x;
      if(y<min_y) min_y = y;
      if(y>max_y) max_y = y;
    }
    lines.push(pts);
  }

  //center design
  const offset_x = (canvas_x - max_x-min_x)/2;
  const offset_y = (canvas_y - max_y-min_y)/2;
  translate(offset_x, offset_y);

  for(let j=0; j<lines.length;j++){
    if(random()>(1-skip_chance)) continue;
    const l = lines[j];

    beginShape();

    let circle_drawn = false;
    for(let i=0; i<l.length; i++){
      const pt = l[i];
      const weight = LEPEN*global_scale * 3/4;
      center_rotate(rotate_per_line);
      curveVertex(pt[0], pt[1]);
      push();
      if(!circle_drawn && random()>1.9999){
        strokeWeight(weight);
        stroke("GREEN");
        const x = pt[0];
        const y = pt[1];
        let rad = random(30, 150)*global_scale;
        while(rad>0){
          circle(x,y, rad);
          rad -= weight;
        }
        circle_drawn = true;
      }
      pop();
    }

    vertex(canvas_x*2, canvas_y*2);
    vertex(-canvas_x*2, canvas_y*2);


    endShape(CLOSE);


  }


  pop();

  global_draw_end();
}
//***************************************************
//custom funcs
