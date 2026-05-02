'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 60;
const capture = false;
const capture_time = 50/fr;

let bg_c, shapes, weight, z;


const suggested_palettes = [];
function gui_values(){
  parameterize("rows", floor(base_y/16), 1, floor(base_y/2), 1, false);
  parameterize("step_size", 2, 1, smaller_base/50, 1, true);
  parameterize("frame_split", 30, 1, fr * 10, 1, false);
  parameterize("num_per_frame", 20, 1, 100, 1, false);
}

function setup() {
  common_setup();
  gui_values();

  z = 0;

  shapes = [];

  for(let i=0; i<20; i++){
    shapes.push(create_plume());
  }

  shapes.sort((a, b) => b.radius - a.radius);

  bg_c = png_bg(true);
  fill(bg_c);
  
  weight = LEPEN * global_scale;
  strokeWeight(weight);

  back_lines(rows);
}
//***************************************************


function draw() {
  global_draw_start(false);
  push();

  for(let j=0; j<num_per_frame; j++){

    if(z % frame_split == 0){
      const new_plumes = [];
      for(let i=0; i<shapes.length; i++){
        const current_shape = shapes[i];
        new_plumes.push(create_plume(current_shape));
      }
      shapes = new_plumes
    }

    const remove_index = []
    for(let i=0; i<shapes.length; i++){
      const current_shape = shapes[i];

      if(current_shape.radius < weight*4) remove_index.push(i)

      const max_angle = lerp(90, 180, (canvas_y - current_shape.y)/current_shape.y);
      const angle = -90 + map(noise(current_shape.noise_offset, z/100), 0,1, -max_angle, max_angle);

      current_shape.x += current_shape.step_size * cos(angle);
      current_shape.y += current_shape.step_size * sin(angle);

      if(off_page(current_shape)){
        remove_index.push(i)
      } else{
        if(z % 2 == 0) stroke("BLACK");
        else stroke(bg_c);
        push();
        translate(current_shape.step_size * random(-1,1), current_shape.step_size * random(-1,1));
        circle(current_shape.x, current_shape.y, current_shape.radius * 2);
        pop();
      }
    }

    for(let i=shapes.length-1; i>=0; i--){
      if(remove_index.includes(i)){
        shapes.splice(i,1)
      }
    }

    if(shapes.length == 0) noLoop();
    z++;
  }
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
function create_plume(parent, step_min=2*global_scale, step_max=6*global_scale){
  if(parent == null){
    const plume = {
      x: canvas_x/2,
      y: canvas_y,
      step_size: random(step_min, step_max),
      noise_offset: random(1000)
    }
    plume.radius = lerp(smaller_base/100, smaller_base/16, map(plume.step_size, step_min,step_max, 0,1));
    return plume
  }

  return {
    x: parent.x,
    y: parent.y,
    step_size: parent.step_size,
    radius: parent.radius,
    noise_offset: random(1000)
  }
}

function off_page(shape){
  const x = shape.x;
  const y = shape.y;
  const dia = shape.radius*2;
  return x < -dia || x > canvas_x + dia || y < -dia || y > canvas_y + dia;
}

function back_lines(back_rows = 50){
  const row_step_size = canvas_y / back_rows;
  push();
  translate(0, row_step_size/2);
  for(let i=0; i<back_rows; i++){
    push();
    translate(0, i * row_step_size);
    line(0,0, canvas_x, 0);
    pop();
  }
  pop();
}