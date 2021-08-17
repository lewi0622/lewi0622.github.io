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
  palette = [[228, 153, 95, 255], 
  [145, 202, 195, 255], 
  [75, 153, 139, 255],
  [65, 71, 83, 255],
  [221, 241, 242, 255]]
}

//***************************************************
function setup() {
  cnv = createCanvas(canvas_x, canvas_y);
  cnv.mouseClicked(show_hide_controls);
  seed_scale_button();
  reset_values();
  reset_drawing();
  angleMode(DEGREES);
  noLoop();
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
function draw_diag(len){
  if (random() >= 0.5){
    // top left to bottom right
    line(0, 0, len, len);
  }
  else{
    // top right to bottom left
    line(len, 0, 0, len);
  }
}

function draw_cardinal(len){
  if (random() >= 0.5){
    // vertical line
    line(len / 2, 0, len / 2, len);
  }
  else{
    // horizontal line
    line(0, len / 2, len, len / 2);
  }
}

function tile(x_tiles, y_tiles, length, funcs, colors=['#000000'], iterations=1, x_offset_min=0, x_offset_max=0, y_offset_min=0, y_offset_max=0){
  for (loop_num = 0; loop_num < iterations; loop_num++){
    for (i = 0; i < x_tiles; i++){
      for (j = 0; j < y_tiles; j++){
        push();
        stroke(random(colors));
        translate(i*length + i_offset, j*length + j_offset);
        func = random(funcs);
        func(length);
        pop();
      }
    }
    i_offset += random(x_offset_min, x_offset_max);
    j_offset += random(y_offset_min, y_offset_max);
  }
}