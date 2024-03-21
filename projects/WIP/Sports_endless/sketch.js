'use strict';
//setup variables
let gif = true;
let animation = true;
const fr = 5;
const capture = false;
const capture_time = 10;

const suggested_palettes = [GAMEDAY, BIRDSOFPARADISE, SOUTHWEST, NURSERY];

let num_shapes, total_shapes, shapes, bg_c, same_side, canvas_rotaion;

function gui_values(){
  parameterize("cols", 10, 1, 100, 1, false);
  parameterize("padding", random(40,100), 0, 100, 1, true);
  parameterize("thickness", 5, 1, 100, 1, false);
  parameterize("shadow_opacity", 50, 1, 255, 1, false);
  parameterize("rot", random(7), 0, 180, 1, false);
}

function setup() {
  common_setup();
  gui_values();
  total_shapes = floor(random(8,20));
  shapes = [];
  canvas_rotaion = random([0,90,180,270]);
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  const grid_step_size = round((canvas_x - padding * 2) / cols);
  const rows = floor((canvas_y - padding * 2) / grid_step_size);
  noStroke();
  center_rotate(canvas_rotaion);
  translate(padding, padding);
  if(frameCount == 1){
    refresh_working_palette();
    bg_c = random(working_palette);
    reduce_array(working_palette, bg_c);
  }

  if(shapes.length<total_shapes) create_new_shape(rows, grid_step_size);

  shapes.sort((a, b) => {
    if(a.area<b.area) return 1;
    if(a.area>b.area) return -1;
    return 0;
  });


  background(bg_c);
  const shadow_c = color("black");
  shadow_c.setAlpha(shadow_opacity);
  drawingContext.shadowBlur = 1*global_scale;
  drawingContext.shadowColor = color(shadow_c);

  for(let i=0; i<shapes.length; i++){
    push();
    const s = shapes[i];  
    fill(s.c);
    rotate(random(-rot,rot));
    drawingContext.shadowOffsetX = lerp(5,0,i/shapes.length)*global_scale;
    drawingContext.shadowOffsetY = lerp(5,0,i/shapes.length)*global_scale;
    for(let j=0; j<thickness; j++){
      const x = s.x + 0.25 * j * global_scale;
      const y = s.y + 0.25 * j * global_scale;
      rect(x,y, s.size_x, s.size_y,s.corner);
    }
    
    if(s.timer>0) s.timer--;
    else{ //walk offscreen
      if(!s.leaving){
        const coords = get_offscreen_coords();
        s.start_x = coords.x;
        s.start_y = coords.y;
        s.leaving = true;
      }
      else{//check if offscreen
        const x_offscreen = s.x > 1.5*canvas_x || s.x < -canvas_x/2;
        const y_offscreen = s.y > 1.5*canvas_y || s.y < -canvas_y/2;
        if(x_offscreen || y_offscreen) s.remove = true;
      }
    }

    if(s.leaving){
      s.x = lerp(s.x, s.start_x, 0.05);
      s.y = lerp(s.y, s.start_y, 0.05);
    }
    else{
      s.x = lerp(s.x, s.start_x, 0.1);
      s.y = lerp(s.y, s.start_y, 0.1);
    }

    pop();
  }

  for(let i=shapes.length-1; i>=0; i--){
    if(shapes[i].remove){
      shapes.splice(i,1);
    }
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
function create_new_shape(rows, grid_step_size){
  let size_x = round(random(cols/2) * grid_step_size);
  let size_y = round(random(rows/2) * grid_step_size);

  let start_x = random(0, grid_step_size*cols - size_x);
  let start_y = random(0, grid_step_size*rows - size_y);

  const c = random(working_palette);

  const coords = get_offscreen_coords();

  shapes.push({
    start_x:start_x,
    start_y:start_y,
    size_x:size_x,
    size_y:size_y,
    x:coords.x,
    y:coords.y,
    area:size_x * size_y,
    c:c,
    corner: random([0,canvas_x]),
    timer: floor(random(20,100)),
    leaving: false,
    remove: false
  });
}

function get_offscreen_coords(){
  let x,y;
  let chance = random();
  if(chance<0.25){ //left
    x = -canvas_x;
    y = random(canvas_y);
  }
  else if(chance<0.5){ //top
    x = random(canvas_x);
    y = -canvas_y;
  }
  else if(chance<0.75){ //right
    x = 2*canvas_x;
    y = random(canvas_y);
  }
  else{ //bottom
    x = random(canvas_x);
    y = 2 * canvas_y;
  }
  return{x:x, y:y};
}