'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

let font;
function preload() {
  font = loadFont('..\\..\\fonts\\Roboto-Black.ttf');
}

function gui_values(){
  parameterize("rows", round(base_y/4), 1, base_y, 1, false);
  parameterize("font_size", round(smaller_base * 3/4), 1, smaller_base*2, 1, true);
  parameterize("max_angle", 180, 0, 360, 1, false);
  parameterize("x_damp", 100, 1, 500, 1, false);
  parameterize("y_damp", 100, 1, 500, 1, false);
  parameterize("length_mult", 3, 1, 10, 0.1, false);
  parameterize("walk_iterations", 100, 1, 500, 1, false);
  parameterize("tightness", 0, -5, 5, 0.1, false);
  parameterize("max_walks", 2, 1, 100, 1, false);
} 

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  strokeWeight(MICRON05*global_scale);
  const grid_size = canvas_y / rows;
  const cols = round(canvas_x / grid_size);


  const points = font.textToPoints(random(["E"]), 0,0, font_size, { sampleFactor:  2 });
  const letter_map = map_letter_edges(points, rows, cols, grid_size)

  //find upper left starting tile
  let starting_tile;
  for(let j=floor(cols/2); j<cols; j++){
    const current_row = letter_map[j];

    //if current row has no ON values, skip it
    const sum = current_row.reduce((acumulator, currentValue) => acumulator + currentValue, 0);
    if(sum == 0) continue;

    //lookahead for first ON value
    starting_tile = {
      j: j,
      i: current_row.findIndex(e => e === 1)
    }

    //check diagonally down and to the right for a non-filled tile
    for(let i=1; i<10; i++){
      if(letter_map[starting_tile.j][starting_tile.i + i] == 0){
        starting_tile = {
          j: starting_tile.j,
          i: starting_tile.i + i
        }
        break;
      }
    }
    break;
  }

  bucket_fill(starting_tile, letter_map);

  curveTightness(tightness);

  noFill();
  stroke("BLACK")
  walk_flower(letter_map, walk_iterations, grid_size);

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
function walk_flower(letter_map, iterations, grid_size){

  for(let i=0; i<iterations; i++){
    //pick a point that's a 1
    let col = floor(random(letter_map.length));
    let row = floor(random(letter_map[col].length));

    while(letter_map[col][row] == 0){
      col = floor(random(letter_map.length));
      row = floor(random(letter_map[col].length));
    }
    
    beginShape();

    //random walk on grid until 0
    while(letter_map[col][row] == 1){
      vertex(col * grid_size, row * grid_size);

      const walks = floor(random(1,max_walks));
      
      let last_dir, options;

      for(let j=0; j<walks; j++){
        
        if(last_dir == "UP") options = ["UP", "LEFT", "RIGHT"];
        else if(last_dir = "DOWN") options = ["DOWN", "LEFT", "RIGHT"];
        else if(last_dir = "LEFT") options = ["UP", "DOWN", "LEFT"];
        else if(last_dir = "RIGHT") options = ["UP", "DOWN", "RIGHT"];

        const dir = random(options);
        if(dir == "UP") row --;
        else if(dir == "DOWN") row ++;
        else if(dir == "LEFT") col --;
        else if(dir == "RIGHT") col ++;

        last_dir = dir
      }
    }

    const flower =  random() > 0.95;

    if(flower){
      vertex(col * grid_size, row * grid_size);
      vertex(col * grid_size, row * grid_size);
      circle(col * grid_size, row * grid_size, grid_size * 4);
    }
    endShape();
  }
}


function bucket_fill(starting_tile, letter_map){
  //fill starting_tile
  letter_map[starting_tile.j][starting_tile.i] = 1;
  const unfilled = get_unfilled_neighbors(starting_tile, letter_map);

  for(let i=0; i<unfilled.length; i++){
    const unfilled_tile = unfilled[i];
    if(letter_map[unfilled_tile.j][unfilled_tile.i] == 0){
      bucket_fill(unfilled_tile, letter_map);
    }
  }
}

function get_unfilled_neighbors(tile, letter_map){
  const unfilled_neighbors = [];

  //check up
  if(tile.i != 0 && letter_map[tile.j][tile.i-1] == 0){
    unfilled_neighbors.push({
      j: tile.j,
      i: tile.i -1
    })
  }

  //check left
  if(tile.j != 0 && letter_map[tile.j-1][tile.i] == 0){
    unfilled_neighbors.push({
      j: tile.j - 1,
      i: tile.i
    })
  }

  //check down
  if(tile.i + 1 != letter_map[tile.j].length && letter_map[tile.j][tile.i+1] == 0){
    unfilled_neighbors.push({
      j: tile.j,
      i: tile.i +1
    })
  }

  //check right
  if(tile.j +1 != letter_map.length && letter_map[tile.j+1][tile.i] == 0){
    unfilled_neighbors.push({
      j: tile.j +1,
      i: tile.i
    })
  }

  return unfilled_neighbors;
}


function offset_text(pts, rows, cols, grid_step_size){
  let min_x = canvas_x;
  let max_x = -canvas_x;
  let min_y = canvas_y;
  let max_y = -canvas_y;
  for(let i=0; i<pts.length; i++){
    const pt = pts[i];
    if(min_x > pt.x) min_x = pt.x;
    if(max_x < pt.x) max_x = pt.x;
    if(min_y > pt.y) min_y = pt.y;
    if(max_y < pt.y) max_y = pt.y;
  }
  const offset = {
    x: (cols*grid_step_size)/2 - (max_x-min_x)/2, 
    y: (rows*grid_step_size)/2 + (max_y-min_y)/2
  };

  return offset
}

function map_letter_edges(pts, rows, cols, grid_step_size){
  const offset = offset_text(pts, rows, cols, grid_step_size);

  const edge_map = [];
  for(let i=0; i<cols; i++){ // fill edge map with 0s
    const row = Array(rows).fill(0);
    edge_map.push(row);
  }

  for(let i=0; i<pts.length; i++){
    const pt = pts[i];
    //locate which tile the point is in
    const tile_i = floor((pt.x + offset.x)/grid_step_size);
    const tile_j = floor((pt.y + offset.y)/grid_step_size);

    if(tile_i<0 || tile_i>=cols || tile_j<0 || tile_j >= rows) continue;
    edge_map[tile_i][tile_j] = 1; //turn on edge tile
  }

  return edge_map;
}
