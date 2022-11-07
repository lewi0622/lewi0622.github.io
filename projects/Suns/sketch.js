'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
suggested_palettes = [BEACHDAY, SOUTHWEST, SUPPERWARE]


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
  const bg_c = random(working_palette)
  background(bg_c)
  reduce_array(working_palette, bg_c)

  //actual drawing stuff
  push();
  strokeCap(ROUND);

  const start = createVector(0,canvas_y,0);
  const end = createVector(canvas_x,0,0);
  const steps = 10;
  const radius = 65*global_scale;
  strokeWeight(4*global_scale)

  center_rotate(random([0,90,180,270]));
  const suns = random([2,4])

  for(let j=0;j<suns;j++){
    const c = random(working_palette);
    stroke(c);
    fill(c);

    if(suns==4){
      center_rotate(90);
    }

    circle(0,0,radius);
    for(let i=1; i<steps; i++){
      const v3 = p5.Vector.lerp(start, end, i/steps);
      line(0,0,v3.x,v3.y);
    }
    if(suns == 2){
    center_rotate(random([-90,0,90]));
    }

    translate(canvas_x, canvas_y);
    rotate(180);
  }
  pop();
  //cutlines
  apply_cutlines(bleed_border);

  capture_frame(capture);
}
//***************************************************
//custom funcs


