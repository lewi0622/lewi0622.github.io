//template globals
let input, button, randomize;

let up_scale = 1;
let canvas_x = 400*up_scale;
let canvas_y = 400*up_scale;
let hidden_controls = false;

// project globals
let i_offset = 0;
let j_offset = 0;
let line_length = 60*up_scale;
let tile_width = canvas_x / line_length;
let tile_height = canvas_y / line_length;
let palette;

//global func, can be blank
function reset_values(){
  //reset project values here for redrawing 

}

//***************************************************
function setup() {
  common_setup();
}
//***************************************************
function draw() {
  //line width
  strokeWeight(10*up_scale);
  
  //set background, and remove that color from the palette
  bg = random(palette)
  background(bg);
  reduce_array(palette, bg);
  
  //tile lines
  tile(tile_width, tile_height, line_length, funcs=[draw_diag, draw_cardinal], 
    colors=palette, iterations=Math.round(random(3,10)), 
    x_offset_min=0, x_offset_max=0,
    y_offset_min=0, y_offset_max=0);
  
}
//***************************************************
//custom funcs
