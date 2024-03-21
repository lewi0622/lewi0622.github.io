'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 30;
const capture = false;
const capture_time = 15;

const suggested_palettes = [];

let inc, min_line_len, c1, c2, c3;
let pcts;

function gui_values(){
  parameterize("num_lines", 4000, 1, 4500, 10, false);
  parameterize("max_line_len", 175, -400, 400, 1, true);
}

function setup() {
  common_setup();
  gui_values();
  min_line_len = 0;
  inc = global_scale;
  c1 = random(working_palette);
  c2 = c1;
  while(arrayEquals(c1, c2)){
    c2 = random(working_palette);
  }
  c3 = c2;
  while(arrayEquals(c2,c3)){
    c3 = random(working_palette);
  }
  c1 = color(c1);
  c2 = color(c2);
  c3 = color(c3);

  pcts = [];
  for(let i=0; i<num_lines; i++){
    pcts.push({
      p: random()
    });
    if(pcts[i].p<0.5) pcts[i].c = lerpColor(c3, c2, map(pcts[i].p, 0, 0.5, 0,1));
    else pcts[i].c = lerpColor(c2, c1, map(pcts[i].p, 0.5, 1, 0,1));

  }
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  strokeWeight(0.1*global_scale);
  const rot_step = 3600/num_lines;
  translate(canvas_x/2, canvas_y/2);
  background(c1);
  for(let i=0; i<num_lines; i++){
    push();
    rotate(rot_step * i);
    const line_len = map(pcts[i].p, 0,1, min_line_len, max_line_len);
    pcts[i].l = line_len;
    // line(0,0,line_len, 0);

    pop();
  }

  for(let i=0; i<num_lines; i++){
    push();
    rotate(rot_step * i);
    if(type != "svg"){
      noStroke();
      fill(pcts[i].c);
    }
    // if(random()>lerp(0.7,1,i/num_lines)) blendMode(ADD);
    rotate(map(sin(frameCount*2), -1,1, 0, 60));
    drawingContext.shadowBlur = lerp(0,5, 1-(pcts[i].l/max_line_len))*global_scale;
    drawingContext.shadowColor = pcts[i].c;
    circle(pcts[i].l, 0, lerp(30, 10, i/num_lines)*global_scale);
    pop();
  }

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs
