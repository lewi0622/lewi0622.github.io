'use strict';

//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
suggested_palettes = [MUTEDEARTH];

function gui_values(){
  parameterize("cols", 4, 1, 50, 1, false);
  parameterize("rows", 4, 1, 50, 1, false);  
  parameterize("circle_rad", 10, 1, 200, 1, true);
  parameterize("x_margin", 100, 0, 400, 1, true);
  parameterize("y_margin", 100, 0, 400, 1, true);
  parameterize("drift", 0.1, 0, 10, 0.1, true);
  parameterize("growth", 1, 0, 5, 0.1, true);
  parameterize("layers", 50, 1, 200, 1, false);
  parameterize("blur_size", 2, 0, 20, 0.1, true);
}

function setup() {
  common_setup();
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  noStroke();
  translate(x_margin, y_margin);
  let bg_c = color("BLACK");
  background(bg_c);
  let c = color(random(working_palette));

  let center_coords = [floor(random(cols)), floor(random(rows))];
  
  const x_step_size = (canvas_x-x_margin*2)/cols;
  const y_step_size = (canvas_y-y_margin*2)/rows;

  let radius = circle_rad;
  for(let z=0; z<layers; z++){
    const current_c = lerpColor(bg_c, c, z/layers);
    fill(current_c);
    drawingContext.shadowColor = current_c;
    drawingContext.shadowBlur = blur_size;
    for(let i=0; i<cols; i++){
      for(let j=0; j<rows; j++){
        push();
        translate((i+1)*x_step_size, (j+1)*y_step_size);
        translate(circle_rad, circle_rad);
        if(i<center_coords[0]) translate(-drift*z, 0);
        else if(i>center_coords[0]) translate(drift*z, 0);

        if(j<center_coords[1]) translate(0, -drift*z);
        else if(j>center_coords[1]) translate(0, drift*z);

        circle(0,0, radius);

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