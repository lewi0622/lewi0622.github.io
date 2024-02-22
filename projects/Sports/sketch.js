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
  // parameterize("num_shapes", floor(random(8, 20)), 1, 50, 1, false);
  parameterize("thickness", 5, 1, 100, 1, false);
  parameterize("shadow_opacity", 50, 1, 255, 1, false);
  parameterize("rot", random(10), 0, 180, 1, false);
  parameterize("pop_on", random([0,1]), 0, 1, 1, false); //pop=0; shuffle=1;
}

function setup() {
  common_setup();
  num_shapes = 1;
  total_shapes = floor(random(8,20));
  shapes = [];
  canvas_rotaion = random([0,90,180,270]);
  same_side = random()>0.5;
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

    for(let i=0; i<total_shapes; i++){
      const x_lerp = lerp(cols, 0, i/total_shapes);
      let size_x = random(x_lerp);
      size_x = round(size_x * grid_step_size);
  
      const y_lerp = lerp(0, rows, i/total_shapes);
      let size_y = random(y_lerp);
      size_y = round(size_y * grid_step_size);
  
      let start_x = random(0, grid_step_size*cols - size_x);
      start_x = round(start_x/grid_step_size)*grid_step_size;
      let start_y = random(0, grid_step_size*rows - size_y);
      start_y = round(start_y/grid_step_size)*grid_step_size;
  
      const c = random(working_palette);
  
      let x,y;
      let chance = random();
      if(same_side) chance = 0;
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

      shapes.push({
        start_x:start_x,
        start_y:start_y,
        size_x:size_x,
        size_y:size_y,
        x:x,
        y:y,
        area:size_x * size_y,
        c:c,
        corner: random([0,canvas_x])
      });
    }
    shapes.sort((a, b) => {
      if(a.area<b.area) return 1;
      if(a.area>b.area) return -1;
      return 0;
    });
  }

  background(bg_c);

  for(let i=0; i<num_shapes; i++){
    push();
    const s = shapes[i];  
    console.log(s);
    fill(s.c);
    rotate(random(-rot,rot));
    const shadow_c = color("black");
    shadow_c.setAlpha(shadow_opacity);
    drawingContext.shadowBlur = 1*global_scale;
    drawingContext.shadowColor = color(shadow_c);
    drawingContext.shadowOffsetX = lerp(5,0,i/num_shapes)*global_scale;
    drawingContext.shadowOffsetY = lerp(5,0,i/num_shapes)*global_scale;
    for(let j=0; j<thickness; j++){
      const x = s.x + 0.25 * j * global_scale;
      const y = s.y + 0.25 * j * global_scale;
      rect(x,y, s.size_x, s.size_y,s.corner);
    }
    if(pop_on){
      s.x = s.start_x;
      s.y = s.start_y;
    }
    else{
      s.x = lerp(s.x, s.start_x, 0.1);
      s.y = lerp(s.y, s.start_y, 0.1);
    }

    pop();
  }

  if(num_shapes<total_shapes) num_shapes++;

  if(frameCount>60)noLoop();

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
