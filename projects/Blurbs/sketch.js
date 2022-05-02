gif = false;
fr = 1;

function setup() {
  //default palette for this sketch only
  default_palette = random([0, 2, 14]);
  common_setup(gif);
  frameRate(fr);
  line_length = 60*global_scale;
  tile_width = canvas_x / line_length;
  tile_height = canvas_y / line_length;

  // createLoop({duration:10, gif:{fileName:"instanceMode.gif"}})
}
//***************************************************
function draw() {
  //bleed
  bleed_border = apply_bleed();

  working_palette = [...palette];
  strokeCap(random([PROJECT,ROUND]))

  //apply background
  bg_c = random(working_palette)
  background(bg_c)
  reduce_array(working_palette, bg_c)

  //actual drawing stuff
  push();
  center_rotate(random([0,90,180,270]));

  //line width
  strokeWeight(10*global_scale);

  //tile lines
  tile(tile_width, tile_height, line_length, funcs=[draw_diag, draw_cardinal], 
    colors=working_palette, iterations=1, 
    x_offset_min=0, x_offset_max=0,
    y_offset_min=0, y_offset_max=0);
  
  pop();
  //cutlines
  apply_cutlines();
}
//***************************************************
//custom funcs




