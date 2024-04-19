'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 10;
const capture = false;
const capture_time = 30;

const suggested_palettes = [SAGEANDCITRUS, BUMBLEBEE, GAMEDAY, SOUTHWEST];
let bg_c, whirl_color;
let z = 0;
const z_inc = 0.05;

function gui_values(){
  parameterize("circles_per_stage", 50, 1, 100, 1, false);
  parameterize("stages", 75, 1, 100, 1, false);
  parameterize("largest_rad", 200, 0, smaller_base, 1, true);
  parameterize("damp", 6, 1, 100, 1, false);
  parameterize("max_stroke_weight", 2.5, 1, 100, 0.1, false);
} 

function setup() {
  common_setup();
  gui_values();

  refresh_working_palette();
  bg_c = png_bg(true);
  whirl_color = random(working_palette);
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  background(bg_c);
  const ending_rad = 0;
  stroke(whirl_color);
  fill(bg_c);
  strokeCap(SQUARE);

  // let last_x = map(noise(z/10), 0,1, 0, canvas_x);
  let last_x = canvas_x/8;

  for(let j=0; j<stages; j++){
    const starting_rad = map(noise(j,z), 0,1, 0.5, 1.5) * lerp(0, largest_rad, j/stages);

    let new_x = map(noise(j/10, z), 0,1, canvas_x/4, canvas_x);
    new_x = constrain(new_x, last_x, last_x+starting_rad);

    push();
    translate(new_x, lerp(canvas_y, canvas_y/3, j/stages))

    for(let i=0; i<circles_per_stage; i++){
      push();
      if(i%2==1){
        stroke(bg_c);
        strokeCap(ROUND);
        // drawingContext.setLineDash([random(1,20)*global_scale, random(1,20)*global_scale, random(1,20)*global_scale, random(1,20)*global_scale]);
      }
      if(i==0) strokeWeight(4*global_scale); //first loop
      else strokeWeight(random(0.1, max_stroke_weight)*global_scale);
      if(j+1 == stages && i/circles_per_stage>0.6){
        fill(whirl_color);// last stage
        stroke(whirl_color);
      }
      rotate(noise(i/500, j/10, z)*360);
      const radius = lerp(starting_rad, ending_rad, i/circles_per_stage);
      ellipse(random(5*global_scale),random(5*global_scale), map(noise(i/damp, j, z), 0,1, 0.8,1)*radius, map(noise(i/damp, j, z), 0,1, 0.25,0.75)*radius);
  
      pop();
    }
    pop();
  }

  z += z_inc;

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
