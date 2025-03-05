'use strict'
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

let line_array, bg_c, circle_c;

function gui_values(){
}

function setup() {
  common_setup();
  pixelDensity(1);
  line_array = [];
  bg_c = png_bg(true);
  circle_c = random(working_palette);
  circle_c = color(circle_c);
  circle_c.setAlpha(200);
  for(let i=0; i<1; i++){
    add_line();
  }
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();
  push();
  background(bg_c);
  strokeWeight(2*global_scale);
  translate(random(-0.5,0.5)*global_scale, random(-0.5,0.5)*global_scale);

  for(let i=0; i<line_array.length; i++){
    blurred_lines(line_array[i]);
  }

  for(let i=line_array.length-1; i>=0; i--){
    if(line_array[i].pct >= 100) remove_line(i);
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
function add_line(
  start_pt = {x: random(canvas_x), y: random(canvas_y)},
  end_pt = {x: random(canvas_x), y: random(canvas_y)}
){
  const new_line = {
    start_pt: start_pt,
    end_pt: end_pt,
    pct: 0,
    num_lines: 5,
    c: random(working_palette)
  }

  line_array.push(new_line);
}

function remove_line(index){
  const old_line = line_array.splice(index, 1)[0];
  add_line(old_line.end_pt);
}

function blurred_lines(line_obj){
  const start_x = lerp(line_obj.start_pt.x, line_obj.end_pt.x, line_obj.pct/100);
  const start_y = lerp(line_obj.start_pt.y, line_obj.end_pt.y, line_obj.pct/100);
  stroke(line_obj.c);
  noFill();
  for(let i=0; i<line_obj.num_lines; i++){
    push();
    translate((-line_obj.num_lines/2 + i) * 10*global_scale,0);
    beginShape();
    for(let j=0; j<20; j++){
      const x = lerp(start_x, line_obj.end_pt.x, j/20);
      const y = lerp(start_y, line_obj.end_pt.y, j/20);
      const x_wobble = random(-1,1) * global_scale;
      const y_wobble = random(-1,1) * global_scale;
      vertex(x + x_wobble,y + y_wobble);
    }
    endShape(); 
    pop();
  }

  line_obj.pct += 5;
}
