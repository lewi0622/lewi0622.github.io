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
  //bleed
  bleed_border = apply_bleed();

  //apply background
  bg(true);

  //actual drawing stuff

  //line width
  strokeWeight(2*global_scale);
  
  //tile lines
  tile(tile_width, tile_height, line_length, funcs=[draw_diag, draw_cardinal], 
    colors=palette, iterations=50, 
    x_offset_min=x_offset_min*global_scale, x_offset_max=x_offset_max*global_scale,
    y_offset_min=y_offset_min*global_scale, y_offset_max=y_offset_max*global_scale);

  //cutlines
  apply_cutlines();
      
  save_drawing();
}
//***************************************************
//custom funcs