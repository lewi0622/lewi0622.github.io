'use strict';
//setup variables
const gif = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
let suggested_palette;


function gui_values(){

}

function setup() {
  suggested_palette = random([COTTONCANDY, BIRDSOFPARADISE, SOUTHWEST]);
  common_setup(gif);
}
//***************************************************
function draw() {
  capture_start(capture);

  //bleed
  const bleed_border = apply_bleed();

  let working_palette = JSON.parse(JSON.stringify(palette));

  //apply background
  let bg_c = random(working_palette)
  background(bg_c)
  reduce_array(working_palette, bg_c)

  //actual drawing stuff
  push();

  translate(canvas_x/2, canvas_y/2);
  rotate(random(360));
  for(let i=0; i<40; i++){
    //confine start vector to circle
    const start = createVector(random(-canvas_x/8, canvas_x/8), random(-canvas_y/8, canvas_y/8), 0);
    const steps = random(50,100);
    const scale_factor = 2*global_scale
    const slope = start.y/start.x;
    let radius = random(5,20)*global_scale;

    //init 
    let prev_x = start.x;
    let prev_y = start.y;

    noStroke();
    //get two unique colors
    const col1 = color(random(palette));
    let  col2 = color(random(palette));
    while(col2==col1){
      col2=random(palette);
    }
    push();
    for(let j=0; j<steps; j++){
      fill(lerpColor(col1, col2, j/steps));
      const new_x = start.x + Math.sign(start.x)*j*scale_factor
      const new_y = new_x*slope;
      radius += random(-2, 2)*global_scale
      ellipse(new_x, new_y, random(radius*.75, radius*1.5), random(radius*.75, radius*1.5));
      rotate(random(-4,4));
      prev_x = new_x;
      prev_y = new_y;
    }
    pop();
  }

  pop();
  //cleanup
  apply_cutlines(bleed_border);

  capture_frame(capture);
}
//***************************************************
//custom funcs
