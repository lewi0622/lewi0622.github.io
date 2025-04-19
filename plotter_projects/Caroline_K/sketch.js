'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 5;
const capture = false;
const capture_time = 50/fr;

const suggested_palettes = [];
const clockwise_directions = ["right", "down", "left", "up"];
const counterclockwise_directions = ["right", "up", "left", "down"];
let concave_corner, num_rows, tile_size, weight, c_idx, bg_c;

function gui_values(){
  parameterize("num_cols", 20, 1, 100, 1, false);
  parameterize("x_damp", 10, 1, 100, 1, false);
  parameterize("y_damp", 10, 1, 100, 1, false);
}

function setup() {
  common_setup();
  gui_values();

}
//***************************************************
function draw() {
  global_draw_start();
  push();
  noFill();
  strokeWeight(TAOTREE * global_scale);
  const grid_size = canvas_x/num_cols;
  const num_rows = ceil(canvas_y/grid_size);
  
  stroke("YELLOW");
  for(let i=0; i<=num_cols; i++){
    line(i * grid_size, 0, i * grid_size, canvas_y);
    line(i * grid_size + grid_size/2, 0 , i * grid_size + grid_size/2, canvas_y);
  }
  for(let i=0; i<=num_rows; i++){
    line(0, i * grid_size, canvas_x, i * grid_size);
    line(0, i * grid_size + grid_size/2, canvas_x, i * grid_size  + grid_size/2);    
  }
  const weight = TRANSON_1 * global_scale;
  strokeWeight(weight);
  const c1 = color("RED");
  c1.setAlpha(100);
  stroke(c1);
  
  for(let i=0; i<=num_cols; i++){
    for(let j=0; j<num_rows; j++){
      push();
      let direction = 1;
      let shape_width = direction * grid_size * noise(i/x_damp,j/y_damp);
      if(j % 2 == 0){
        direction = -1;
        shape_width = direction * grid_size * noise(i/x_damp + 50, j/y_damp + 50);
      }
      if(i * grid_size > canvas_x) continue;
      if(i * grid_size + direction < 0 || i * grid_size + direction > canvas_x) continue;
      if(j * (grid_size + 1) < 0 || j * (grid_size+1) > canvas_y) continue;
      translate(i * grid_size, j * grid_size);
      const x = weight/4;
      const y = weight/4;

      beginShape();
      curveVertex(x,y);
      curveVertex(x,y);
      
      curveVertex(shape_width, grid_size/2);
      
      curveVertex(x, grid_size - y);
      curveVertex(x, grid_size - y);
      endShape();

      beginShape();
      curveVertex(x,y);
      curveVertex(x,y);
      
      curveVertex(shape_width/2, grid_size/2);

      
      curveVertex(x, grid_size - y);
      curveVertex(x, grid_size - y);
      endShape();

      line(x, y, x, grid_size - y);
      
      pop();
    }
  }
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
