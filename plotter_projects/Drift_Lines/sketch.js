gif = false;
fr = 1;

capture = false;
capture_time = 10;
function setup() {
  suggested_palette = random([BUMBLEBEE, SIXTIES, SUPPERWARE]);
  common_setup(gif, SVG);

  line_length = 60*global_scale;
  tile_width = canvas_x / line_length;
  tile_height = canvas_y / line_length;
}
//***************************************************
function draw() {
  capture_start(capture);
  i_offset = 0;
  j_offset = 0;

  x_offset_min = 0;
  x_offset_max = 20;
  y_offset_min = 0;
  y_offset_max = 20;

  //bleed
  bleed_border = apply_bleed();

  background("#abada0")
  working_palette = JSON.parse(JSON.stringify(palette));
  strokeCap(random([PROJECT,ROUND]))

  //actual drawing stuff
  push();
  center_rotate(random([0, 90, 180, 270]));
  //line width
  strokeWeight(2*global_scale);
  
  //tile lines
  tile(tile_width, tile_height, line_length, funcs=[draw_diag, draw_cardinal], 
    colors=working_palette, iterations=50, 
    x_offset_min=x_offset_min*global_scale, x_offset_max=x_offset_max*global_scale,
    y_offset_min=y_offset_min*global_scale, y_offset_max=y_offset_max*global_scale);

  pop();
  //cutlines
  apply_cutlines();

  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs