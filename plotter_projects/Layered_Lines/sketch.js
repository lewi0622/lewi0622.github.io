'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

let grid, col_step, row_step, line_spacing, num_lines;

function gui_values(){
  parameterize("cols", 10, 1, 100, 1, false);
  parameterize("rows", floor(random(2, 15)), 1, 100, 1, false);
  parameterize("horiz_steps_per_tile", floor(random(2, 11)), 1, 100, 1, false);
  parameterize("num_curves", 10, 1, 100, 1, false);
  parameterize("num_curve_colors", 6, 1, 10, 1, false);
  parameterize("num_squares", 10, 1, 100, 1, false);
  parameterize("num_square_colors", 6, 1, 10, 1, false);
} 

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();
  push();
  noFill();
  let weight = PARALLEL24*global_scale;

  //generate grid with small y offsets
  grid = [];
  col_step = canvas_x/cols;
  row_step = canvas_y/rows;
  line_spacing = weight * 1.25;
  num_lines = round(row_step/line_spacing);

  for(let i=0; i<rows; i++){
    let y_offset = 0;
    const row = [];
    for(let j=0; j<cols; j++){
      row.push({x:j*col_step, y:i*row_step + y_offset});
      y_offset += random(-line_spacing/2, line_spacing/2);
    }
    grid.push(row);
  }

  //parallel pen full grid
  strokeWeight(weight);
  stroke("PINK");
  draw_grid_lines(0, rows, 0, cols, "curve");

  //posca
  const posca_colors = gen_n_colors(num_curve_colors);
  for(let k=0; k<num_curves; k++){
    const c = color(random(posca_colors));
    c.setAlpha(125);
    stroke(c);
    strokeWeight(POSCA*global_scale);
  
    const starting_row = floor(random(rows/2));
    const ending_row = round(random(starting_row+1, rows));
    const starting_col = floor(random(cols/2));
    const ending_col = round(random(starting_col+1, cols));

    const val = random();
    if(val>0.66) draw_grid_lines(rows-ending_row, rows-starting_row, starting_col, ending_col, "curve"); 
    else if(val<0.3) draw_grid_lines(starting_row, ending_row, cols-ending_col, cols-starting_col); 
    else draw_grid_lines(starting_row, ending_row, starting_col, ending_col);

  }

  //fineline
  const fineline_colors = gen_n_colors(num_square_colors);
  for(let i=0; i<num_squares; i++){
    const c = color(random(fineline_colors));
    c.setAlpha(125);
    stroke(c);
    strokeWeight(PILOTPRECISEV5*global_scale);
  
    const starting_row = floor(random(rows/2));
    const ending_row = round(random(starting_row+1, rows));
    const starting_col = floor(random(cols/2));
    const ending_col = round(random(starting_col+1, cols));

    const val = random();
    if(val>0.66) draw_grid_lines(rows-ending_row, rows-starting_row, starting_col, ending_col, "square"); 
    else if(val<0.3) draw_grid_lines(starting_row, ending_row, cols-ending_col, cols-starting_col); 
    else draw_grid_lines(starting_row, ending_row, starting_col, ending_col);
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
function draw_grid_lines(starting_row, ending_row, starting_col, ending_col, type){
  for(let i=starting_row; i<ending_row; i++){
    for(let z=0; z<num_lines; z++){
      let y = grid[i][starting_col].y + z*line_spacing;
      if(type=="curve") draw_curve(i, z, y, starting_col, ending_col);
      else if(type=="square") draw_squares(i, z, y, starting_col, ending_col);
    }
  }
}

function draw_curve(i, z, y, starting_col, ending_col){
  beginShape();
  for(let j=starting_col; j<ending_col; j++){
    const tile = grid[i][j];
    let x = tile.x;
    for(let k=0; k<horiz_steps_per_tile; k++){
      x += col_step/horiz_steps_per_tile;
      y = lerp(y, tile.y + z*line_spacing, 0.01);
      curveVertex(x,y);
      if(j+1 == ending_col) curveVertex(x,y);
    }
  }
  endShape();
}

function draw_squares(i, z, y, starting_col, ending_col){
  for(let j=starting_col; j<ending_col; j++){
    const tile = grid[i][j];
    let x = tile.x;
    for(let k=0; k<horiz_steps_per_tile; k++){
      x += col_step/horiz_steps_per_tile;
      y = lerp(y, tile.y + z*line_spacing, 0.01);
      if(k%2==0) square(x,y,2*global_scale);
      if(j+1 == ending_col) curveVertex(x,y);
    }
  }
}