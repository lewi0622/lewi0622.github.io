'use strict';

//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
suggested_palettes = [BIRDSOFPARADISE, NURSERY];

function gui_values(){
  parameterize("cols", round(random(3,20)), 1, 50, 1, false);
  parameterize("rows", round(random(3,20)), 1, 50, 1, false);  
  parameterize("circle_rad", random(5,10), 1, 200, 1, true);
  parameterize("x_margin", random(50,100), 0, 400, 1, true);
  parameterize("y_margin", random(50,100), 0, 400, 1, true);
  parameterize("drift", random(0,1), 0, 10, 0.1, true);
  parameterize("growth", random(0.3), 0, 1, 0.01, true);
  parameterize("layers", round(random(10,70)), 1, 200, 1, false);
  parameterize("blur_size", random(0.5,2), 0, 20, 0.1, true);
  blend_mode = random([0, 11]);
}

function setup() {
  common_setup();
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  let bg_c = color("BLACK");
  background(bg_c);

  noStroke();

  translate(x_margin, y_margin);
  //
  const bright_colors = [];
  working_palette.forEach((p,index) => {
    if(RGBA_to_HSBA(...p)[2]>60) bright_colors.push(index);
  });

  let c; 
  if(bright_colors.length>0){
    c = working_palette[random(bright_colors)];
  }
  else c = random(working_palette);
  
  c = color(c);

  let center_coords = [floor(random(cols)), floor(random(rows))];
  
  const x_step_size = (canvas_x-x_margin*2)/(cols);
  const y_step_size = (canvas_y-y_margin*2)/(rows);

  let radius = circle_rad;
  for(let z=0; z<layers; z++){
    if(z+1 == layers){
      if(random()>0.5) stroke("BLACK");
      strokeWeight(0.03*global_scale);
    }
    const current_c = lerpColor(bg_c, c, z/layers);
    fill(current_c);
    fill(c);
    drawingContext.shadowColor = current_c;
    drawingContext.shadowBlur = blur_size;
    for(let i=0; i<cols; i++){
      for(let j=0; j<rows; j++){
        push();
        translate(i*x_step_size, j*y_step_size);
        translate(circle_rad, circle_rad);

        let theta; 
        if(i == center_coords[0]){
          if(j<center_coords[1]) theta = 270;
          else if(j>center_coords[1]) theta = 90;
        }
        else if(j == center_coords[1]){
          if(i<center_coords[0]) theta = 180;
          else if(i>center_coords[0]) theta = 0;
        }
        else{
          theta = atan((j-center_coords[1])/(i-center_coords[0]));
          if(i<center_coords[0]) theta += 180;
        }

        let x=0;
        let y=0;
        if(theta != null){
          x = drift*z*cos(theta);
          y = drift*z*sin(theta);
        }

        circle(x,y, radius);

        pop();
      }
    }
    radius += growth;
  }
  pop();

  global_draw_end();
}
//***************************************************
//custom funcs