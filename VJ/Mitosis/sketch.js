'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 20;
let capture_delay_seconds = 10;

let grid_bg_c;
const suggested_palettes = [GAMEDAY, BIRDSOFPARADISE, NURSERY, SUPPERWARE];

let swimmers, bg_c;

function gui_values(){
  parameterize("number_of_swimmers", 100, 1, 1000, 1, false);
  parameterize("heading_change", 25, 0, 180, 1, false);
  parameterize("swimmer_starting_rad", 25, 1, 100, 1, true);
  parameterize("swimmer_tail_length", 10, 1, 100, 1, false);
  parameterize("swimmer_movement_speed", 10, 0.1, 20, 0.1, true);
  parameterize("px_blur", 15, 0, 50, 1, true);
  parameterize("thr", 0.3, 0.3, 0.8, 0.01, false);
}

function setup() {
  common_setup();
  gui_values();

  swimmers = [];
  bg_c = random(working_palette);
  reduce_array(working_palette, bg_c);

  noStroke();
  //SCALE UP INSTEAD OF USING DIFFERENT PIXEL DENSITY
  // pixelDensity(2);
  document.body.style.background = "BLACK";
}
//***************************************************
function draw() {
  global_draw_start(true, 3);

  //actual drawing stuff
  push();
  background("BLACK");
  let swimmers_to_remove = [];
  drawingContext.filter = 'blur(' + String(px_blur) + 'px)'
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
      circle(tail_coords.x, tail_coords.y, lerp(0,swimmer_starting_rad, (tail_index+1) /swimmer_tail_length));
    });

  }

  threshold_alpha(thr);
  
  pop();

  global_draw_end();
}
//***************************************************
//custom funcs

function spawn_swimmers(tail_legnth){
  const x = random(canvas_x/4, canvas_x*3/4);
  const y = random(canvas_y/4, canvas_y*3/4);

  let swimmer = {};
  swimmer.heading = random(360);
  swimmer.color = color("WHITE")//random(working_palette);
  swimmer.tail = new Array(tail_legnth).fill({x:x, y:y});
  swimmers.push(swimmer);
}

function threshold_alpha(thr){
  loadPixels();
  for(let i=0; i<pixels.length; i+=4){
    const r = pixels[i];
    const g = pixels[i+1];
    const b = pixels[i+2];
    const gray = (r+g+b)/(255*3);
    if(gray < thr) pixels[i+3] = 0;
    else{
      pixels[i] = 255;
      pixels[i+1] = 255;
      pixels[i+2] = 255;
    }
  }

  updatePixels();
}