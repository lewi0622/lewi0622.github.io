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
  //bleed
  bleed_border = apply_bleed();

  //apply background
  bg(true);

  //actual drawing stuff
  push();
  center_rotate(random([0,90,180,270]));

  //line width
  strokeWeight(10*global_scale);
  
  //tile lines
  tile(tile_width, tile_height, line_length, funcs=[draw_diag, draw_cardinal], 
    colors=palette, iterations=random([2,3]), 
    x_offset_min=0, x_offset_max=0,
    y_offset_min=0, y_offset_max=0);

  pop();
  //cutlines
  apply_cutlines();
  
  save_drawing();
}
//***************************************************
//custom funcs
