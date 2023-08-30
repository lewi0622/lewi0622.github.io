'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
suggested_palettes = [COTTONCANDY, SIXTIES, SUPPERWARE]


function gui_values(){
  parameterize("rows", 50, 1, 100, 1, false);
  parameterize("cols", 20, 1, 100, 1, false);
  parameterize("square_min_size", 5, 1, 20, 1, true);
  parameterize("square_max_size", 30, 1, 100, 1, true);
}

function setup() {
  common_setup(6*96, 8*96, SVG);
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  // rect(0,0,canvas_x, canvas_y);
  rectMode(CENTER);

  const col_step_size = canvas_x/cols;
  const row_step_size = canvas_y/rows;

  stroke("RED");
  for(let z=0; z<2; z++){
    if(z==1){
      stroke("BLUE");
      center_rotate(180);
    }
    let shapes = [];
    for(let i=0; i<rows; i++){
      const square_chance = i/rows;
      for(let j=0; j<cols; j++){
        if(random()<square_chance){
          const shape_data = {};
          shape_data["rotation"] = random(360);
          shape_data["size"] = random(square_min_size, square_max_size);
          shape_data["x"] = j*col_step_size;
          shape_data["y"] = i*row_step_size;
          shapes.push(shape_data);
        };
      }
    }

    shapes = shuffle(shapes);

    shapes.forEach(shape_data => {
      push();
      print(shape_data.x, shape_data.y);
      translate(shape_data.x, shape_data.y);
      rotate(shape_data.rotation);
      square(0,0, shape_data.size);
      pop();
    });
  }
  pop();

  global_draw_end();
}
//***************************************************
//custom funcs
