'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
suggested_palettes = [COTTONCANDY, BIRDSOFPARADISE, SOUTHWEST]


function gui_values(){

}

function setup() {
  common_setup(gif);
}
//***************************************************
function draw() {
  capture_start(capture);
  //bleed
  const bleed_border = apply_bleed();

  refresh_working_palette();

  //apply background
  let bg_c = random(working_palette)
  background(bg_c)
  reduce_array(working_palette, bg_c)

  //actual drawing stuff
  push();
  translate(canvas_x/2, canvas_y/2);
  const dir = random([-1,1]);
  for(let i=0; i<50; i++){
    //confine start vector to circle
    const theta = noise(i)*360;
    const start_rad = random(20,50)*global_scale;
    const start = createVector(start_rad*cos(theta), start_rad*sin(theta), 0);
    const steps = random(75,150);
    const scale_factor = 1.5*global_scale;
    const slope = start.y/start.x;
    let radius = random(1,10)*global_scale;

    //init 
    let prev_x = start.x;
    let prev_y = start.y;

    noStroke();
    //get two unique colors
    let col1 = color(random(palette));
    let col2 = color(random(palette));
    while(col2==col1){
      col2=random(palette);
    }

    for(let j=0; j<steps; j++){
      fill(lerpColor(col1, col2, j/steps));
      const new_x = start.x + Math.sign(start.x)*j*scale_factor;
      const new_y = new_x*slope;
      radius += random(-2, 2)*global_scale
      ellipse(new_x, new_y, random(radius*.75, radius*1.5), random(radius*.75, radius*1.5));
      rotate(random(0,4)*dir);
      prev_x = new_x;
      prev_y = new_y;
    }
  }
 
  pop();
  //cleanup
  apply_cutlines(bleed_border);

  capture_frame(capture);
}
//***************************************************
//custom funcs
