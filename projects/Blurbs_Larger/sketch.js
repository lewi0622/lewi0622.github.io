//template globals
let input, button, randomize;

let hidden_controls = false;

//project globals
let i_offset = 0;
let j_offset = 0;
let palette, canvas_x, canvas_y, line_length, tile_width, tile_height, up_scale;

//global func, can be blank
function reset_values(){
  //reset project values here for redrawing 
  up_scale = global_scale/2;

  canvas_x = 800*up_scale;
  canvas_y = 800*up_scale;
  line_length = 60*up_scale;
  tile_width = canvas_x / line_length;
  tile_height = canvas_y / line_length;
}

//***************************************************
function setup() {
  common_setup();
}
//***************************************************
function draw() {
  strokeWeight(75*up_scale);
  bg = random(palette)
  background(bg);
  let index = palette.indexOf(bg);
  if (index > -1) {
    palette.splice(index, 1);
  }
  tile(tile_width, tile_height, line_length, funcs=[draw_diag, draw_cardinal], 
    colors=palette, iterations=1, 
    x_offset_min=0, x_offset_max=0,
    y_offset_min=0, y_offset_max=0);
}
//***************************************************
//custom funcs
