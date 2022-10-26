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
  suggested_palette = random([COTTONCANDY, GAMEDAY, BIRDSOFPARADISE]);
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

  center_rotate(random([0, 180]));

  noStroke();
  const rect_width = floor(canvas_x/4);
  const rect_height = floor(canvas_y*0.75);
  const shape=random(['square', 'circle']);
  //best if even
  const step = 2*global_scale;
  translate(canvas_x/16, 0);

  let pow_arr = [0.5, 1.2, 3]
  pow_arr = shuffle(pow_arr);
  for(let i=0; i<3; i++){
    push();
    translate((canvas_x/16+canvas_y/4)*i, canvas_y/8);
  
    noise_matrix(rect_width, rect_height, step, true, true, 0, 1, pow_arr[i],  i, shape);
    pop();
  }

  pop();
  //cutlines
  apply_cutlines(bleed_border);

  capture_frame(capture);
}
//***************************************************
//custom funcs
function noise_matrix(rect_width, rect_height, step, rotate, reverse, min, max, pow, seed, shape){
  //creates a matrix of noise going from more likely to less. Use rotate to swap i/j. Use reverse to change noise density sides
  if(rotate==true){
    [rect_width, rect_height] = [rect_height, rect_width];
  }
  for(let i=0; i<150; i++){
    let chance = constrain(Math.pow(i/150, pow), min, max);
    if(reverse==true){
      chance = 1-chance;
    }
    
    for(let j=0; j<50; j++){
      push();
      const pixel_c = random(palette);
      fill(pixel_c);

      if(rotate == true){
        translate(j*step, i*step);
      }
      else{
        translate(i*step, j*step);
      }
      if(noise((i+1)*(j+1)+seed)>chance){
        if(shape=='square'){
          square(0,0,random(step/2, step*2));
        }
        else if(shape=='circle'){
          circle(step/2, step/2 ,random(step/2, step*2));
        }
      }
      pop();
    }
  }
}