//template globals
let input, button, randomize;

let hidden_controls = false;

// project globals
let i_offset = 0;
let j_offset = 0;
let palette, canvas_x, canvas_y, line_length, tile_width, tile_height;
let base_x = 400;
let base_y = 400; 

//global func, can be blank
function reset_values(){
  //reset project values here for redrawing 

  line_length = 60*global_scale;
  tile_width = canvas_x / line_length;
  tile_height = canvas_y / line_length;
}

//***************************************************
function setup() {
  common_setup();
}
//***************************************************
function draw() {
  //line width
  strokeWeight(10*global_scale);
  strokeCap(random([PROJECT,ROUND]));
  
  //set background, and remove that color from the palette
  bg = random(palette)
  background(bg);
  reduce_array(palette, bg);

  //tile lines
  tile(tile_width, tile_height, line_length, funcs=[draw_diag, draw_cardinal], 
    colors=palette, iterations=1, 
    x_offset_min=0, x_offset_max=0,
    y_offset_min=0, y_offset_max=0);
  
  save_drawing();
}
//***************************************************
//custom funcs




