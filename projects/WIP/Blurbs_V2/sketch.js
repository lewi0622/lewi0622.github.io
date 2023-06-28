'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
suggested_palettes = [SAGEANDCITRUS, COTTONCANDY, SUPPERWARE]

function gui_values(){
  parameterize("Weight", 10, 0, 100, 0.1, true,false);
  parameterize("Line_length", 60, 10, 100, 0.1, true, false);
  parameterize("Rotation", random([0,90,180,270]), 0, 360, 90, false, true);  
  // parameterize("iterations", 1, 1, 100, 1, false, false);
}

function setup() {
  common_setup(gif);
}
//***************************************************
function draw() {
  capture_start(capture);
  blendMode(modes[blend_mode]);
  //bleed
  const bleed_border = apply_bleed();

  //projct variables
  const cols = round(canvas_x / Line_length);
  const rows = round(canvas_y / Line_length);

  //set line length to fit within the number of rows/cols
  Line_length = canvas_x/cols;

  //generate lines
  const line_coordinates = [];
  for(let i=0; i<cols*rows; i++){
    if(random()>0.5){
      //draws a diagonal line
      if (random() >= 0.5) line_coordinates.push([0, 0, Line_length, Line_length]);// top left to bottom right
      else line_coordinates.push([Line_length, 0, 0, Line_length]);// top right to bottom left
    }
    else{
      //draws a cardinal line
      if (random() >= 0.5) line_coordinates.push([Line_length / 2, 0, Line_length / 2, Line_length]);// vertical line
      else line_coordinates.push([0, Line_length / 2, Line_length, Line_length / 2]);// horizontal line
    }
  }

  //actual drawing stuff
  push();
  let cutouts = floor(random(2,5));
  for(let z=0; z<cutouts; z++){
    const sketch = createGraphics(canvas_x, canvas_y);
    sketch.angleMode(DEGREES);
    sketch.translate(canvas_x/2, canvas_y/2);
    sketch.rotate(Rotation);
    sketch.translate(-canvas_x/2, -canvas_y/2);

    //line width
    sketch.strokeWeight(Weight);

    refresh_working_palette();
    //apply background
    let bg_c = random(working_palette);
    sketch.background(bg_c)
    reduce_array(working_palette, bg_c)
    for(let i=0; i<cols; i++){
      for(let j=0; j<rows; j++){
        sketch.push();
        sketch.stroke(random(working_palette));
        sketch.translate(i*Line_length, j*Line_length);
        sketch.line(...line_coordinates[j+rows*i]);
        sketch.pop();
      }
    }
    push();
    if(z != 0){
      strokeWeight(5*global_scale);
      noStroke();
      circle(random([canvas_x/4, canvas_x/2, canvas_x*3/4]), random([canvas_y/4, canvas_y/2, canvas_y*3/4]), random(100,300)*global_scale)
      drawingContext.clip();
    }
    image(sketch,0,0,canvas_x,canvas_y);
    pop();
  }
  pop();
  //cutlines
  apply_cutlines(bleed_border);
  capture_frame(capture);
}
//***************************************************
//custom funcs
