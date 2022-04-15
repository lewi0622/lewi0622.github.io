function setup() {
  common_setup();
  i_offset = 0;
  j_offset = 0;

  line_length = 60*global_scale;
  tile_width = canvas_x / line_length;
  tile_height = canvas_y / line_length;

  x_offset_min = 0;
  x_offset_max = 20;
  y_offset_min = 0;
  y_offset_max = 20;
}
//***************************************************
function draw() {
  //bleed
  bleed_border = apply_bleed();

  //apply background
  bg(true);

  //actual drawing stuff
  push();
  center_rotate(random([0, 90, 180, 270]));
  //line width
  strokeWeight(2*global_scale);
  
  //tile lines
  tile(tile_width, tile_height, line_length, funcs=[draw_diag, draw_cardinal], 
    colors=palette, iterations=50, 
    x_offset_min=x_offset_min*global_scale, x_offset_max=x_offset_max*global_scale,
    y_offset_min=y_offset_min*global_scale, y_offset_max=y_offset_max*global_scale);

  pop();
  //cutlines
  apply_cutlines();
}
//***************************************************
//custom funcs