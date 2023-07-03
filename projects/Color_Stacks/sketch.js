'use strict';

//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
let x_fourth, y_fourth;
suggested_palettes = [COTTONCANDY, SOUTHWEST, NURSERY, SIXTIES]

function gui_values(){
  parameterize("grid_num_col", floor(random(1, 100)), 1, 150, 1, false);
  parameterize("stroke_alpha", 80, 0, 255, 1, false);
}

function setup() {
  common_setup();
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();
  let bg_c;
  //set custom background colors
  if(global_palette_id == COTTONCANDY){
    //grey or tan
    bg_c = working_palette[random([2,4])];
  }
  else if(global_palette_id == SOUTHWEST){
    //tan
    bg_c = working_palette[2];
  }
  else if(global_palette_id == NURSERY){
    //tan, mint green, or light purple
    bg_c = working_palette[random([0,3,5])];
  }
  else if(global_palette_id == SIXTIES){
    //tan
    bg_c = working_palette[0];
  }
  else{bg_c = color(random(working_palette));}

  background(bg_c);
  working_palette.forEach((c, idx) => {
    working_palette[idx] = color(c);
  });

  //rotation chance
  if(random()>0.5) center_rotate(90);

  //project variables
  const offset_x = canvas_x/8;
  const offset_y = canvas_y/8;

  //find the smaller offset and use that for both edges
  let smaller_offset = min(offset_x, offset_y);

  let grid_size_col = (canvas_x-smaller_offset)/grid_num_col; 
  //minimum 4 layers to cover up background color, plateaus after that
  const layers = floor(random(4,11));

  noStroke();

  //actual drawing stuff
  push();
  for(let z=0; z<layers; z++){
    for(let j=0; j<grid_num_col; j++){
      const grid_num_row = floor(random(4, 40));
      let grid_size_row = (canvas_y-smaller_offset)/grid_num_row;

      const init_c = random(working_palette);
      let second_c = init_c;
      while(second_c == init_c){
        second_c = random(working_palette);
      }
      let third_c = second_c;
      while(third_c == second_c){
        third_c = random(working_palette);
      }
      init_c.setAlpha(100);
      second_c.setAlpha(150);
      third_c.setAlpha(100);

      const crossover = random(0.25, 0.75);
      // const crossover = map(noise((j+z)/10), 0,1, 0.25, 0.75);
      const smoothness = floor(random(20)+1);
      const choose_noise = random()>0.25;
      for(let i=0; i<grid_num_row; i++){
        push();
        let c;
        if((i+1)/grid_num_row>crossover){
          if(choose_noise) c = lerpColor(second_c, third_c, map(noise((i*(j+1))/smoothness), 0,1, 0,grid_num_row)/grid_num_row);
          else c = lerpColor(second_c, third_c, random(0,grid_num_row/2)/grid_num_row);
        }
        else{
          if(choose_noise) c = lerpColor(init_c, second_c, map(noise((i*(j+1))/smoothness), 0,1, 0,grid_num_row)/grid_num_row);
          else c = lerpColor(init_c, second_c, random(0,grid_num_row/2)/grid_num_row);
        }
        fill(c);
        translate(smaller_offset/2, smaller_offset/2);
        translate(j*grid_size_col, i*grid_size_row);
        rect(0,0, grid_size_col, grid_size_row);
        pop();
      }
    }
  }
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs