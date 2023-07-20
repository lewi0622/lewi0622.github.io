'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
let grid_bg_c;
suggested_palettes = [GAMEDAY, BIRDSOFPARADISE, NURSERY, SUPPERWARE];

let swimmers = [];
let bg_c;

function gui_values(){
  parameterize("number_of_swimmers", floor(random(50,120)), 1, 1000, 1, false);
  parameterize("heading_change", random(20,60), 0, 180, 1, false);
  parameterize("swimmer_starting_rad", random(10,30), 1, 100, 1, true);
  parameterize("swimmer_tail_length", floor(random(10, 40)), 1, 100, 1, false);
  parameterize("swimmer_movement_speed", random(1,10), 0.1, 10, 0.1, true);
}

function setup() {
  common_setup();
  noStroke();
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  let swimmers_to_remove = [];

  //background stuff
  if(frameCount==1){
    refresh_working_palette();
    bg_c = random(working_palette);
    reduce_array(working_palette, bg_c);
  }
  background(bg_c);


  //check to see which swimmers are fully offscreen
  swimmers.forEach((swimmer, swimmer_index) => {
    let tail_in_screen = false;
    swimmer.tail.forEach(tail => {
      if((tail.x>0 && tail.x<canvas_x) || (tail.y>0 && tail.y<canvas_y)) tail_in_screen = true;
    });
    if(!tail_in_screen) swimmers_to_remove.push(swimmer_index);
  });

  //remove swimmers offscreen
  swimmers_to_remove.forEach(swimmer_index => {
    swimmers.splice(swimmer_index,1);
  });

  //if less than n are on screen, spawn as many as necessary
  if(swimmers.length<number_of_swimmers) spawn_swimmers(swimmer_tail_length);

  //move swimmers
  for(let j=0; j<swimmers.length; j++){
    fill(swimmers[j].color);

    //allow movement within +/-45 degrees from heading.
    const theta = random(swimmers[j].heading-heading_change, swimmers[j].heading+heading_change);
    swimmers[j].heading = theta;
    const radius = random(swimmer_movement_speed/2, swimmer_movement_speed);

    const new_x = swimmers[j].tail[0].x + radius*cos(theta);
    const new_y = swimmers[j].tail[0].y + radius*sin(theta);
    //rotate tail array
    const new_tail = arrayRotate(swimmers[j].tail,1);
    new_tail[0] = {x:new_x, y:new_y};
  
    new_tail.forEach((tail_coords, tail_index) => {
      circle(tail_coords.x, tail_coords.y, lerp(0,swimmer_starting_rad, tail_index/swimmer_tail_length));
    });

  }

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs

function spawn_swimmers(tail_legnth){
  const x = random(canvas_x/4, canvas_x*3/4);
  const y = random(canvas_x/4, canvas_x*3/4);

  let swimmer = {};
  swimmer.heading = random(360);
  swimmer.color = random(working_palette);
  swimmer.tail = new Array(tail_legnth).fill({x:x, y:y});
  swimmers.push(swimmer);
}