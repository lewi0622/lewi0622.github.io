//template globals
let input, button, randomize;

let up_scale = 0.5;
let canvas_x = 800*up_scale;
let canvas_y = 800*up_scale;
let hidden_controls = false;

//project globals
let line_length = 60*up_scale;
let tile_width = canvas_x / line_length;
let tile_height = canvas_y / line_length;
let i_offset = 0;
let j_offset = 0;
let palette;

//global func, can be blank
function reset_values(){
  //reset project values here for redrawing 
  palette = JSON.parse(JSON.stringify(global_palette));
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
