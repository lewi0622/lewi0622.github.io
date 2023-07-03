'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
suggested_palettes = [COTTONCANDY, GAMEDAY, BIRDSOFPARADISE]


function gui_values(){
  parameterize("flip", random([0,1]), 0, 1, 1, false);
  parameterize("num_steps", 150, 1, 300, 1, false);
  parameterize("num_shapes", 50, 0, 100, 1, false);
  parameterize("stack1_dist", 0.5, 0.1, 5, 0.1, false);
  parameterize("stack2_dist", 1.2, 0.1, 5, 0.1, false);
  parameterize("stack3_dist", 3, 0.1, 5, 0.1, false);
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

  center_rotate(flip*180);

  if(random()>0.5) noStroke();
  else strokeWeight(0.05*global_scale);
  const shape=random(['square', 'circle']);
  //best if even
  const step = 2*global_scale;
  translate(canvas_x/16, 0);

  let pow_arr = [stack1_dist, stack2_dist, stack3_dist];
  pow_arr = shuffle(pow_arr);
  for(let i=0; i<3; i++){
    push();
    translate((canvas_x/16+canvas_y/4)*i, canvas_y/8);
  
    noise_matrix(step, 0, 1, pow_arr[i],  i, shape);
    pop();
  }

  pop();
  
  global_draw_end();
}
//***************************************************
//custom funcs
function noise_matrix(step, min, max, pow, seed, shape){
  //creates a matrix of noise going from more likely to less. Use rotate to swap i/j. Use reverse to change noise density sides
  for(let i=0; i<num_steps; i++){
    let chance = constrain(Math.pow(i/150, pow), min, max);
    chance = 1-chance;
    
    for(let j=0; j<num_shapes; j++){
      push();
      fill(random(palette));

      translate(j*step, i*step);
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