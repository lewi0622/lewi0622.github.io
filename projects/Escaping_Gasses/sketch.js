'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

suggested_palettes = [COTTONCANDY, BIRDSOFPARADISE, SOUTHWEST, SUPPERWARE]
let min_bubble_rot, max_bubble_rot;

function gui_values(){
  parameterize("streams", random(15,100), 1, 100, 1, false);
  parameterize("scale_factor", random(0.1,3), 0.1, 10, 0.1, true);
  parameterize("min_rad", 1, 1, 20, 0.5, true);
  parameterize("max_rad", 10, 1, 40, 0.5, true);
  parameterize('rot', random(360), 0, 360, 45, false);
  parameterize("max_rot", 10, 0, 20, 1, false);
}

function setup() {
  common_setup();
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();

  //apply background
  let bg_c = random(working_palette)
  background(bg_c)
  reduce_array(working_palette, bg_c)

  //actual drawing stuff
  push();

  translate(canvas_x/2, canvas_y/2);
  rotate(rot);

  //chance for bubbles
  let bubbles = random()>0.5;
  //chance for constant slope 
  let const_slope = random()>0.75;
  //chance for mismatched rotation
  if(random()>0.1){
    min_bubble_rot = random(-max_rot,-2);
    max_bubble_rot = -1*min_bubble_rot;
  }
  else{
    min_bubble_rot = random(-max_rot, max_rot);
    max_bubble_rot = random(-max_rot, max_rot);
  }


  for(let i=0; i<streams; i++){
    //confine start vector to circle
    const start = createVector(random(-canvas_x/8, canvas_x/8), random(-canvas_y/8, canvas_y/8), 0);
    const steps = random(50,100);
    let slope = start.y/start.x;
    if(const_slope) slope = 0;
    let radius = random(min_rad,max_rad);

    noStroke();
    //get two unique colors
    const col1 = color(random(palette));
    let  col2 = color(random(palette));
    while(arrayEquals(col2,col1)){
      col2=random(palette);
    }

    //add bubble option
    if(bubbles){
      col1.setAlpha(200);
      col2.setAlpha(200);
    }

    push();
    for(let j=0; j<steps; j++){
      const l_c =  lerpColor(col1, col2, j/steps);
      fill(l_c);
      const new_x = start.x + Math.sign(start.x)*j*scale_factor
      const new_y = new_x*slope;
      radius += random(-2, 2)*global_scale
      ellipse(new_x, new_y, random(radius*.75, radius*1.5), random(radius*.75, radius*1.5));
      rotate(random(min_bubble_rot, max_bubble_rot));
    }
    pop();
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
