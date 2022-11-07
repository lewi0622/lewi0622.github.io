'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
let suggested_palette;


function gui_values(){

}

function setup() {
  suggested_palette = random([BEACHDAY, GAMEDAY, NURSERY]);
  common_setup(gif);
}
//***************************************************
function draw() {
  capture_start(capture);
  //bleed
  const bleed_border = apply_bleed();

  //actual drawing stuff
  push();
  center_rotate(random(360));

  createBackground();

  createSpiral();

  pop();
  //cutlines
  apply_cutlines(bleed_border);
  capture_frame(capture);
}
//***************************************************
//custom funcs
const createBackground = function(){
  push();
  refresh_working_palette();
  strokeCap(random([PROJECT,ROUND]))

  //apply background
  const bg_c = random(working_palette)
  background(bg_c)
  reduce_array(working_palette, bg_c)

  translate(canvas_x/2, canvas_y/2);
  noStroke();
  let c1 = random(working_palette);
  reduce_array(working_palette, c1);

  let c2 = random(working_palette);
  const opacity = 2;
  c1[3] = opacity;
  c2[3] = opacity;
  const ang = 360/floor(random(4,19));
  const steps = 5000;
  for(let i=0; i<steps; i++){
    rotate(ang);
    let c = lerpColor(color(c1), color(c2), i/steps);
    fill(c);
    c = lerpColor(color(c2), color(c1), i/steps);
    stroke(c);
    const x =random(500)*global_scale;
    const size = random(200)*global_scale;
    square(x, 0, size);
  }

  filter("blur", 5*global_scale);
  pop();
}

const createSpiral = function(){
  push();
  noStroke();
  refresh_working_palette();
  const steps = 1000;    
  let c1 = random(working_palette);
  reduce_array(working_palette,c1);
  let c2 = random(working_palette);
  const opacity = 200;
  c1[3] = opacity;
  c2[3] = opacity;
  drawingContext.shadowColor = color(0,0,0,100);
  translate(canvas_x/2, canvas_y/2);
  const phi = random(1,255);
  const dist_scale = random(1.25,2.5);
  //50/50 circle or square.
  const circ = random()>0.5;
  const dir = random([1,-1]);
  for(let i=0; i<steps; i++){
    const f = i/steps;
    const c = lerpColor(color(c1), color(c2), f*2);
    fill(c);
    const radius = sqrt(0.5);
    const angle = i * phi * dir;
    let smaller_cnv = canvas_x;
    if(canvas_y<canvas_x){
      smaller_cnv = canvas_y;
    }
    const distance = f * radius * smaller_cnv*dist_scale;
    const x = cos(angle)*distance;
    const y = sin(angle)*distance;

    const size = map(f, 0,1,0,100)*global_scale;
    drawingContext.shadowBlur = size/floor(random(2,6));
    if(circ){
      circle(x,y, size);
    }
    else{
      square(x-size/2,y-size/2,size);
    }
  }
  pop();
}
