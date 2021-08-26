function reset_values(){
  //reset project values here for redrawing 
  line_length = 40*global_scale;
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
  bg_horizontal_strips(4);

  //cutlines
  apply_cutlines();


  //line width
  strokeWeight(10*global_scale);
  strokeCap(random([PROJECT,ROUND]));

  save_drawing();
}
//***************************************************
//custom funcs




