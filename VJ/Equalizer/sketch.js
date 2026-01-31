'use strict';
//setup variables
let gif = true;
let animation = true;
const fr = 30;
const capture = false;
const capture_time = 10;

const suggested_palettes = [BUMBLEBEE];

let container, line_spacing, pt_step_size;

function gui_values(){
  parameterize("num_stored_lines", 5, 1, 20, 1, false);
  parameterize("num_lines", 2, 1, 100, 1, false);
  parameterize("pts_per_line", floor(base_y/4), 1, floor(base_y/2), 1, false);
  parameterize("margin_x", -base_x/2, -base_x, base_x, 1, true);
  parameterize("granularity", 2, 0, 10, 0.1, false);
}

function setup() {
  common_setup();
  gui_values();

  container = []; //should pre-load with stored lines for looping
  init();
  
  for(let j=0; j<num_stored_lines; j++){
    frameCount = fr * capture_time - (num_stored_lines-j);
    const [xoff, yoff] = noise_loop_2d(fr, capture_time, granularity);
    for(let i=0; i<container.length; i++){
      const current_lines = container[i];
      current_lines.push(create_new_line(i, xoff, yoff));
      while(current_lines.length > num_stored_lines){
        current_lines.shift();
      }
    }
  }

  frameCount = 0;

  stroke("WHITE");
  strokeWeight(1*global_scale);
  noFill();
  document.body.style.background = "BLACK";
  pixelDensity(2);
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();

  init();

  const [xoff, yoff] = noise_loop_2d(fr, capture_time, granularity);
  
  translate(-margin_x/2, 0);

  for(let i=0; i<container.length; i++){
    const current_lines = container[i];
    current_lines.push(create_new_line(i, xoff, yoff));
    while(current_lines.length > num_stored_lines){
      current_lines.shift();
    }

    push();
    translate(i * line_spacing, 0);
    draw_lines(current_lines);
    pop();
  }

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs
function init(){
  line_spacing = (canvas_x + margin_x)/num_lines;
  pt_step_size = canvas_y/pts_per_line;

  //correct for number of lines
  while(container.length != num_lines){
    if(container.length < num_lines) container.push([]);
    else container.pop();
  }
}


function create_new_line(num_line, xoff, yoff){
  const pts = [];
  for (let i = 0; i <= pts_per_line; i++) {
    const y = i * pt_step_size;
    const x = map(pnoise.simplex2((num_line+1)/100 + xoff, (i+1)/100 + yoff), -1,1, -line_spacing*10, line_spacing*10);
    pts.push({x:x, y:y});
  }
  return pts;
}


function draw_lines(line_collection){
  for(let i=0; i<line_collection.length; i++){
    const pts = line_collection[i];
    let c = color("WHITE");
    c.setAlpha(lerp(0, 255, i/line_collection.length));
    stroke(c);
    beginShape();
    for(let k=0; k<pts.length; k++){
      const pt = pts[k];
      vertex(pt.x, pt.y);
    }
    endShape();
  }
}