'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [COTTONCANDY, BUMBLEBEE, SUMMERTIME];

let porcine;
let minnesota;
function preload(){
  minnesota = loadJSON("..\\..\\projects\\WIP\\Minnesota\\minnesota.json");
}

function gui_values(){
  parameterize("num_shapes", floor(random(2,5)), 1, 10, 1, false);
  parameterize("circles_per_shape", floor(random(50,250)), 1, 400, 1, false);
  parameterize("max_rad", smaller_base*2, 1, larger_base*2, 1, true);
  parameterize("num_colors", round(random(1, working_palette.length-1)), 1, working_palette.length-1, 1, false);
  // parameterize("font_size", 100, 0, smaller_base*2, 1, true);
  parameterize("num_cols", 10, 1, 100, 1, false);
  parameterize("num_rows", 10, 1, 100, 1, false);
  parameterize("grid_margin", 10, 0, 100, 1, true);
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
  strokeWeight(2*global_scale);
  working_palette = controlled_shuffle(working_palette, true);
  const bg_c = png_bg(true);
  const colors = [];
  for(let i=0; i<num_colors; i++){
    colors.push(color(working_palette[i]));
    colors[i].setAlpha(200);
  }
  
  translate(canvas_x/2, canvas_y/2);
  for(let i=0; i<num_shapes; i++){
    push();
    stroke(colors[i%colors.length]);
    line_blur(colors[i%colors.length], 1*global_scale)
    translate(random(-1,1)*max_rad/8, random(-1,1)*max_rad/8);
    for(let j=0; j<circles_per_shape; j++){
      const rad = lerp(0, max_rad, j/circles_per_shape);
      rotate(random(360));
      circle(0,0, rad);
    }
    pop();
  }
  pop();
  push();
  //MINNESOTA CUTOUT
  // draw_minnesota(); 

  //GRID CUTOUTS
  // const grid_layers = 2;
  // let ctr = 10;
  // for(let k=0; k<grid_layers; k++){
  //   center_rotate(45);
  //   push();
  //   translate(-canvas_x/2, -canvas_y/2);
  //   const col_step = canvas_x*2/num_cols;
  //   const row_step = canvas_y*2/num_rows;

  //   for(let i=0; i<num_cols; i++){
  //     for(let j=0; j<num_rows; j++){
  //       push();
  //       translate(i*(col_step + grid_margin), j*(row_step + grid_margin));
  //       stroke(ctr);
  //       noFill();
  //       rect(0,0,col_step,row_step);
  //       pop();
  //     }
  //   }
  //   ctr++;
  //   pop();
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
function draw_minnesota(){
  push();
  stroke("BLACK");
  noFill();
  let coords = minnesota.geometry.coordinates[0];

  let min_lon, max_lon, min_lat, max_lat;
  min_lon = 181;
  max_lon = -181;
  min_lat = 91;
  max_lat = -91;

  for(let i=0; i<coords.length; i++){
    if(coords[i][0]<min_lon) min_lon = coords[i][0];
    if(coords[i][0]>max_lon) max_lon = coords[i][0];
    if(coords[i][1]<min_lat) min_lat = coords[i][1];
    if(coords[i][1]>max_lat) max_lat = coords[i][1];
  }

  let padding = 20*global_scale;
  beginShape();
  for (let i = 0; i < coords.length; i++) {
    let lon = coords[i][0];
    let lat = coords[i][1];
    let x = map(lon, min_lon, max_lon, 0+padding, canvas_x-padding)-padding/2;
    let y = map(lat, min_lat, max_lat, canvas_y-padding, 0+padding);

    vertex(x,y);
  }
  endShape(CLOSE);
  pop();
}