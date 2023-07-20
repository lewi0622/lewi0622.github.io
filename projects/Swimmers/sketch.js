'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 2;
const sixteen_by_nine = false;
let grid_bg_c;
suggested_palettes = [BIRDSOFPARADISE];

let swimmers = [];
let bg_c;

function gui_values(){
  parameterize("number_of_swimmers", 1, 1, 100, 1, false);
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

  let swimmer_starting_rad = 10*global_scale;
  let swimmer_tail_length = 20;
  let swimmer_movement_speed = 1*global_scale;
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
    if((swimmer.x<0 || swimmer.x>canvas_x) && (swimmer.y<0 || swimmer.y>canvas_y)){
      let tail_in_screen = false;
      swimmer.tail.forEach(tail => {
        if((tail.x>0 && tail.x<canvas_x) || (tail.y>0 && tail.y<canvas_y)) tail_in_screen = true;
      });
      if(!tail_in_screen) swimmers_to_remove.push(swimmer_index);
    }
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
    const theta = random(swimmers[j].heading-45, swimmers[j].heading+45);
    swimmers[j].heading = theta;
    const radius = swimmer_movement_speed;

    //propagate tail
    for(let i=swimmer_tail_length-1; i>0; i--){
      swimmers[j].tail[i].x = swimmers[j].tail[i-1].x;
      swimmers[j].tail[i].y = swimmers[j].tail[i-1].y;
      circle(swimmers[j].tail[i].x, swimmers[j].tail[i].y, lerp(swimmer_starting_rad,0,i/swimmer_tail_length));
    }

    swimmers[j].tail[0].x = swimmers[j].x;
    swimmers[j].tail[0].y = swimmers[j].y;
    swimmers[j].x += radius*cos(theta);
    swimmers[j].y += radius*sin(theta);

    circle(swimmers[j].x, swimmers[j].y, swimmer_starting_rad);
  }

  // if(frameCount == 20) noLoop();

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs

function spawn_swimmers(tail_legnth){
  const x = random(canvas_x/4, canvas_x*3/4);
  const y = random(canvas_x/4, canvas_x*3/4);

  let swimmer = {};
  swimmer.x = x;
  swimmer.y = y;
  swimmer.heading = random(360);
  swimmer.color = random(working_palette);
  swimmer.tail = new Array(tail_legnth).fill({x:x, y:y});
  swimmers.push(swimmer);
}