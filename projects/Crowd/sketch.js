gif = false;
fr = 1;

capture = false;
capture_time = 10;
function setup() {
  common_setup(gif);
  change_default_palette(random([BEACHDAY, COTTONCANDY, SOUTHWEST]));
  up_scale = global_scale/2;

  line_length = 60*up_scale;
  tile_width = canvas_x / line_length;
  tile_height = canvas_y / line_length;
}
//***************************************************
function draw() {
  capture_start(capture);
  //bleed
  bleed_border = apply_bleed();

  //apply background
  bg();
  strokeCap(random([PROJECT,ROUND]));

  //actual drawing stuff
  push();
  center_rotate(random([0,90,180,270]));

  strokeWeight(75*up_scale);

  tile(tile_width, tile_height, line_length, funcs=[draw_diag, draw_cardinal], 
    colors=palette, iterations=1, 
    x_offset_min=0, x_offset_max=0,
    y_offset_min=0, y_offset_max=0);

  pop();
  //cutlines
  apply_cutlines();
  
  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs
