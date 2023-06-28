gif = false;
fr = 30;

capture = false;
capture_time = 10;


function gui_values(){

}

function setup() {
  common_setup(gif);
}
//***************************************************
function draw() {
  clear();
  capture_start(capture);
  blendMode(modes[blend_mode]);
  //bleed
  const bleed_border = apply_bleed();

  refresh_working_palette();

  //apply background
  bg_c = random(working_palette)
  // background(bg_c)
  reduce_array(working_palette, bg_c)

  //actual drawing stuff
  push();

  noStroke();
  colorMode(HSB);

  stem_start = createVector(canvas_x/2, canvas_y/8);
  vert_stem = createVector(canvas_x/2, canvas_y*7/8);
  stem_end = createVector(random(-canvas_x/4, canvas_x/4)+canvas_x/2, canvas_y*7/8);
  start_width = canvas_x/4;
  rows = 20;
  grape_size = 30*global_scale;
  for(let i=0; i<rows; i++){
    push();
    vert_stem = p5.Vector.lerp(vert_stem, stem_end, i/rows/5);
    translate(p5.Vector.lerp(stem_start, vert_stem, i/rows));
    fill(random(360), 70, 80, 0.2);
    circle(-start_width,0, grape_size);
    circle(start_width,0, grape_size);
    cols = ceil(start_width/grape_size*2);
    console.log(cols)
    for(let j=0; j<cols; j++){
      circle(start_width-grape_size/2*j, 0, grape_size);
      circle(-start_width+grape_size/2*j, 0, grape_size);
    }
    start_width -= grape_size/5;
    start_width = constrain(start_width, 0, start_width);
    pop();
  }



  pop();
  //cutlines
  apply_cutlines(bleed_border);
  capture_frame(capture);
}
//***************************************************
//custom funcs




