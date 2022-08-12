'use strict';

//setup variables
const gif = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
let suggested_palette, working_palette, x_fourth, y_fourth;

function setup() {
  suggested_palette = random([COTTONCANDY, SOUTHWEST, NURSERY, SIXTIES]);
  common_setup(gif);
}
//***************************************************
function draw() {
  capture_start(capture);

  //bleed
  const bleed_border = apply_bleed();

  working_palette = JSON.parse(JSON.stringify(palette));
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

  //project variables
  const offset_x = canvas_x/8;
  const offset_y = canvas_y/8;
  const grid_num_col = floor(random(4, 16));
  const grid_size_col = (canvas_x-offset_x)/grid_num_col; 
  const layers = 10;

  noStroke();

  //actual drawing stuff
  push();
  for(let z=0; z<layers; z++){
    for(let j=0; j<grid_num_col; j++){
      const grid_num_row = floor(random(5, 40));
      const grid_size_row = (canvas_y-offset_y)/grid_num_row;
  
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
      const smoothness = floor(random(20)+1);
      for(let i=0; i<grid_num_row; i++){
        push();
        let c;
        if((i+1)/grid_num_row>crossover){
          c = lerpColor(second_c, third_c, map(noise((i*(j+1))/smoothness), 0,1, 0,grid_num_row)/grid_num_row);
        }
        else{
          c = lerpColor(init_c, second_c, map(noise((i*(j+1))/smoothness), 0,1, 0,grid_num_row)/grid_num_row);
        }
        fill(c);
        translate(offset_x/2, offset_y/2);
        translate(j*grid_size_col, i*grid_size_row);
        rect(0,0, grid_size_col, grid_size_row);
        pop();
      }
    }
  }
  pop();
  //cleanup
  apply_cutlines(bleed_border);

  capture_frame(capture);
}
//***************************************************
//custom funcs