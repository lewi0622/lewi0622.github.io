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
  parameterize("highway_width", 2*96, 1, 800, 1, true);
  parameterize("potential_lines", 100, 1, 500, 1, false);
  parameterize("line_chance", .4, 0, 1, 0.05, false);
} 

function setup() {
  common_setup(4*96, 6*96, SVG);
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();

  //actual drawing stuff
  push();
  
  center_rotate(random([0,180]));//choose rotation, 0,180

  const line_pcts =[];  //the lerp percent to apply for the line
  for(let i=0; i<potential_lines; i++){  //generate Lines from potential lines;
    if(random()<=line_chance) line_pcts.push(i/potential_lines);
  }
  let current_width = highway_width;
  //even is outer corner
  const pt0 = {x:random(current_width/6), y:canvas_y};
  const pt1 = {x:pt0.x + current_width, y:canvas_y};
  current_width += current_width*0.1;
  const pt2 = {x:random(current_width/5), y:0};
  const pt3 = {x:pt2.x + current_width, y:current_width};
  current_width += current_width*0.1;
  const pt4 = {x:canvas_x-random(current_width/4), y:0};
  const pt5 = {x:pt4.x-current_width, y: current_width};
  current_width += current_width*0.1;
  const pt6 = {x:canvas_x-random(current_width), y:canvas_y};
  const pt7 = {x:pt6.x-current_width, y:canvas_y};

  const pts =[pt0, pt1, pt2, pt3, pt4, pt5, pt6, pt7];

  for(let j=0; j<pts.length-2; j+=2){
    //four points for this shape
    const start0 = pts[j];
    const start1 = pts[j+1];
    const end0 = pts[j+2];
    const end1 = pts[j+3];

    //draw occluding shapes
    const occlusion_color = color("RED");
    noStroke();
    fill(occlusion_color);
    beginShape();
    vertex(start0.x, start0.y);
    vertex(end0.x, end0.y);
    vertex(end1.x, end1.y);
    vertex(start1.x, start1.y);
    endShape(CLOSE);

    //draw lines
    stroke("BLACK");
    noFill();
    for(let i=0; i<line_pcts.length; i++){
      const start_x = lerp(start0.x, start1.x, line_pcts[i]);
      const start_y = lerp(start0.y, start1.y, line_pcts[i]);
      const end_x = lerp(end0.x, end1.x, line_pcts[i]);
      const end_y = lerp(end0.y, end1.y, line_pcts[i]);
      line(start_x, start_y, end_x, end_y);
    }
  }
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs