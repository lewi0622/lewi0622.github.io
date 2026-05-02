'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 100;

let grid_bg_c;
const suggested_palettes = [BIRDSOFPARADISE, NURSERY, SIXTIES, JAZZCUP];

const cols = 450;
const rows = 800; // rows val sets size of rows, not actual number of rows
let col_size, row_size, color_swap, color_index, offset_y, num_colors;
let band_min, band_max, last_pct;
let height_vals, amplitude;

//issues:
//not plottable
//doesn't scale well 

function gui_values(){
  parameterize("add_shadows", 1, 0, 1, 1, false);
}

function setup() {
  common_setup(450, 800);
  gui_values();
  pixelDensity(3);

  background(random(working_palette));
  rectMode(CENTER);
  reset_palette();

  band_min = floor(random(10,100));
  band_max = floor(random(band_min, band_min*2));

  col_size = width / cols;
  row_size = height / rows;
  color_index = 200; //arbitrary number above 0 to avoid negative indexing

  height_vals = [];
  for(let i=0; i<4; i++){
    height_vals.push(random(600));
  }
  
  //find and apply y_offset
  const pts = generate_noise_curve(height_vals[0]);
  const [_min_y, max_y] = get_min_max_y(pts);
  offset_y = -1 * max_y - row_size;

}
//***************************************************
function draw() {
  global_draw_start(false);
  //actual drawing stuff
  push();
  translate(0, offset_y); //offset correction
  
  translate(width/2, row_size * frameCount);
  rotate(map(noise(frameCount/10), 0,1, -2,2));
  translate(-width/2, -row_size * frameCount);
  
  set_color();
  const pct = frameCount/(rows);
  
  if(pct < 0.25) amplitude = lerp(height_vals[0], height_vals[1], map(pct, 0, 0.25, 0,1));
  else if (pct < 0.50) amplitude = lerp(height_vals[1], height_vals[2], map(pct, 0.25, 0.5, 0,1));
  else if (pct < 0.75) amplitude = lerp(height_vals[2], height_vals[3], map(pct, 0.5, 1, 0,1));
  
  //look for transition points
  if(last_pct < 0.33 && pct >=0.33) reset_palette(); //mid color scheme
  if(last_pct < 0.75 && pct >=0.75) reset_palette(); //foreground color scheme
  
  last_pct = pct;
  
  const pts = generate_noise_curve(amplitude);
  const [min_y, max_y] = get_min_max_y(pts);

  if(random()>0.2) draw_pts(pts);

  if (min_y + offset_y > height){
    noLoop();
    print("DONE!") 
  }
  pop();

  global_draw_end();
}
//***************************************************
//custom funcs
function generate_noise_curve(amplitude = 0) {
  const pts = [];

  const a = amplitude
  
  for (let i = 0; i < cols; i++) {
    const x = i * col_size;
    let y = frameCount * row_size;
    y += map(noise(i / 200, frameCount / 100),
        0,1,
        -a, 0);
    y += map(noise((i + 50) / 50, (frameCount + 50) / 50),
        0,1,
        -a / 10,a / 10);
    pts.push({ x: x, y: y });
  }
  return pts;
}

function get_min_max_y(pts) {
  let min_y = height * 2;
  let max_y = -height * 2;
  for (let i = 0; i < pts.length; i++) {
    const y = pts[i].y;
    if (y < min_y) min_y = y;
    if (y > max_y) max_y = y;
  }
  return [min_y, max_y];
}

function draw_pts(pts, fill_down = 30) {
  let direction;
  for (let i = 0; i < pts.length; i++) {
    push();
    for (let j = 0; j < fill_down; j++) {
      if(random()>0.7) continue; //grain
      push();
      if(add_shadows){
        if(i + 1 != pts.length) direction = Math.sign(pts[i+1].y - pts[i].y);

        const relative_y = abs(pts[i].y - frameCount * row_size); 
        const n = noise(pts[i].x/10, pts[i].y/10);
        const shadow_depth = map(n, 0,1, 0, 100);
        const brightness_peak = map(n, 0,1, 100, 200);
        if(direction == -1){
          drawingContext.filter = "brightness("+str(lerp(shadow_depth,100, relative_y/amplitude))+"%)"
        } else{
          drawingContext.filter = "brightness("+str(lerp(100, brightness_peak, relative_y/amplitude))+"%)"
        }
      }

      const on = round(noise(i/100, j/100, frameCount/10));
      if(on) set_color(1);
      rect(pts[i].x, pts[i].y + j * row_size, col_size, row_size);
      pop();
    }
    pop();
  }
}

function reset_palette(){
  working_palette = shuffle(working_palette);
  num_colors = round(random(3, working_palette.length));
}

function set_color(index_offset = 0) {
  if (color_swap == undefined) color_swap = floor(random(band_min, band_max));
  if (frameCount % color_swap == 0) {
    if (random() < 0.6) color_index++;
    else color_index--;
    color_swap = floor(random(band_min, band_max));
  }
  const c = working_palette[(color_index + index_offset) % num_colors];

  stroke(c);
  fill(c);
}


function find_grid_tile(x, y) {
  //returns the indicies of the tile within the grid for a given x,y
  if (x < 0 || y < 0) return [-1, -1];
  if (x > cols * col_size || y > rows * row_size) return [-1, -1];

  const row = floor(y / row_size);
  const col = floor(x / col_size);

  return [col, row];
}
