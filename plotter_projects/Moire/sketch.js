'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [COTTONCANDY, BUMBLEBEE, SUMMERTIME];

let porcine;

function gui_values(){
  parameterize("num_shapes", floor(random(2,5)), 1, 10, 1, false);
  parameterize("circles_per_shape", floor(random(50,250)), 1, 400, 1, false);
  parameterize("max_rad", smaller_base*2, 1, larger_base*2, 1, true);
  parameterize("num_colors", round(random(1, working_palette.length-1)), 1, working_palette.length-1, 1, false);
  // parameterize("font_size", 100, 0, smaller_base*2, 1, true);
  parameterize("num_cols", 10, 1, 100, 1, false);
  parameterize("num_rows", 10, 1, 100, 1, false);
} 

function setup() {
  common_setup();
  gui_values();

  // if(!redraw){
  //   opentype.load('..\\..\\fonts\\Porcine-Heavy.ttf', function (err, f) {
  //     if (err) {
  //       alert('Font could not be loaded: ' + err);
  //     } else {
  //       porcine = f;
  //       draw();
  //     }
  //   })
  // }
}
//***************************************************
function draw() {
  // if(!porcine) return;
  global_draw_start();

  //actual drawing stuff
  push();
  refresh_working_palette();
  noFill();
  strokeWeight(0.5*global_scale);
  working_palette = controlled_shuffle(working_palette, true);
  const bg_c = png_bg(true);
  const colors = [];
  for(let i=0; i<num_colors; i++){
    colors.push(color(working_palette[i]));
    // colors[i].setAlpha(200);
  }
  
  translate(canvas_x/2, canvas_y/2);
  for(let i=0; i<num_shapes; i++){
    push();
    stroke(colors[i%colors.length]);
    line_blur(colors[i%colors.length], 1*global_scale)
    translate(random(-1,1)*max_rad/8, random(-1,1)*max_rad/8);
    for(let j=0; j<circles_per_shape; j++){
      const rad = lerp(0, max_rad, j/circles_per_shape);
      circle(0,0, rad);
    }
    pop();
  }
  pop();
  push();
  //rectangular grid with certain boxes filled and others see thru. If SVG each see thru rectangle should have a different stroke line to make separation easy
  // const col_step = canvas_x/num_cols;
  // const row_step = canvas_y/num_rows;
  // let ctr = 10;
  // for(let i=0; i<num_cols; i++){
  //   for(let j=0; j<num_rows; j++){
  //     push();
  //     translate(i*col_step, j*row_step);
  //     stroke(ctr);
  //     noFill();
  //     if(random()>0.8){
  //       fill(bg_c);
  //       stroke(bg_c);
  //     }
  //     rect(0,0,col_step,row_step);
  //     // ctr++;
  //     pop();
  //   }
  // }


  pop();

  // push();
  // noFill();
  // let msg = "B"; // text to write
  // let path = porcine.getPath(msg, 0,0, font_size);

  // let bbox = path.getBoundingBox();
  // translate((canvas_x - bbox.x2 - bbox.x1)/2, (canvas_y - bbox.y2 - bbox.y1)/2);
  // draw_open_type_js_path_p5_commands(path, true);

  // pop();
  global_draw_end();
}
//***************************************************
//custom funcs
