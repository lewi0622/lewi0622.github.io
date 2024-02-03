'use strict';
//setup variables
let gif = false;
let animation = false;
const fr = 10;
const capture = false;
const capture_time = 20;

const suggested_palettes = [GAMEDAY, BIRDSOFPARADISE, SOUTHWEST, NURSERY];

function gui_values(){
  parameterize("cols", 10, 1, 100, 1, false);
  parameterize("padding", random(40,100), 0, 100, 1, true);
  parameterize("num_shapes", floor(random(10, 30)), 1, 100, 1, false);
}

function setup() {
  common_setup();
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();

  const grid_step_size = round((canvas_x - padding * 2) / cols);
  const rows = floor((canvas_y - padding * 2) / grid_step_size);

  refresh_working_palette();
  noStroke();
  const bg_c = random(working_palette);
  reduce_array(working_palette, bg_c);
  background(bg_c);
  translate(padding, padding);
  const shapes = [];
  for(let i=0; i<num_shapes; i++){
    const x_lerp = lerp(cols, 0, i/num_shapes);
    let size_x = random(x_lerp);
    size_x = round(size_x * grid_step_size);

    const y_lerp = lerp(0, rows, i/num_shapes);
    let size_y = random(y_lerp);
    size_y = round(size_y * grid_step_size);

    let start_x = random(0, grid_step_size*cols - size_x);
    start_x = round(start_x/grid_step_size)*grid_step_size;
    let start_y = random(0, grid_step_size*rows - size_y);
    start_y = round(start_y/grid_step_size)*grid_step_size;

    const c = random(working_palette);

    shapes.push({
      start_x:start_x,
      start_y:start_y,
      size_x:size_x,
      size_y:size_y,
      area:size_x * size_y,
      c:c
    });
  }

  shapes.sort((a, b) => {
    if(a.area<b.area) return 1;
    if(a.area>b.area) return -1;
    return 0;
  });

  for(let i=0; i<num_shapes; i++){
    push();
    const s = shapes[i];  
    fill(s.c);
    rotate(random(-10,10));
    const shadow_c = color("black");
    shadow_c.setAlpha(100);
    drawingContext.shadowBlur = 1*global_scale;
    drawingContext.shadowColor = color(shadow_c);
    drawingContext.shadowOffsetX = lerp(5,0,i/num_shapes)*global_scale;
    drawingContext.shadowOffsetY = lerp(5,0,i/num_shapes)*global_scale;
    rect(s.start_x, s.start_y, s.size_x, s.size_y,random([0,45]));
    pop();
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
