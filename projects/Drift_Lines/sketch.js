//template globals
let input, button, randomize;


let hidden_controls = false;

// project globals
let palette, canvas_x, canvas_y, line_length, tile_width, tile_height;
let i_offset, j_offset, x_offset_min, x_offset_max, y_offset_min, y_offset_max;
let base_x = 400;
let base_y = 400;

//global func, can be blank
function reset_values(){
  //reset project values here for redrawing 
  i_offset = 0;
  j_offset = 0;

  line_length = 60*global_scale;
  tile_width = canvas_x / line_length;
  tile_height = canvas_y / line_length;

  //set drift direction
  switch(floor(random(0,3))){
    case 0:
      //no x direction
      x_offset_min = 0;
      x_offset_max = 0;
      break;
    case 1:
      //+x direction
      x_offset_min = 0;
      x_offset_max = 20;
      break;
    case 2:
      //-x direction
      x_offset_min = -20;
      x_offset_max = 0;
      break;
  }
  switch(floor(random(0,3))){
    case 0:
      //no x direction
      y_offset_min = 0;
      y_offset_max = 0;
      break;
    case 1:
      //+x direction
      y_offset_min = 0;
      y_offset_max = 20;
      break;
    case 2:
      //-x direction
      y_offset_min = -20;
      y_offset_max = 0;
      break;
  }
}


//***************************************************
function setup() {
  common_setup();
}
//***************************************************
function draw() {
  //line width
  strokeWeight(2*global_scale);
  
  //set background, and remove that color from the palette
  bg = random(palette)
  background(bg);
  reduce_array(palette, bg);
  
  //tile lines
  tile(tile_width, tile_height, line_length, funcs=[draw_diag, draw_cardinal], 
    colors=palette, iterations=50, 
    x_offset_min=x_offset_min, x_offset_max=x_offset_max,
    y_offset_min=y_offset_min, y_offset_max=y_offset_max);
  
  save_drawing();
}
//***************************************************
//custom funcs