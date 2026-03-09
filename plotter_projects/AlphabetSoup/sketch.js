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


  const points = font.textToPoints(random(["Z"]), 0,0, font_size, { sampleFactor:  2 });
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

    // push();
    // fill("BLUE");
    // square(starting_tile.j * grid_size, starting_tile.i * grid_size, grid_size);
    // pop();

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

  // push();
  // console.log(starting_tile)
  // fill("RED");
  // square(starting_tile.j * grid_size, starting_tile.i * grid_size, grid_size);
  // pop();

  bucket_fill(starting_tile, letter_map);

  stroke("BLACK");
  fill("WHITE");
  for(let j=0; j<cols; j++){
    for(let i=0; i<rows; i++){
      const tile = letter_map[j][i];
      if(tile == 1){
        push();
        translate(j * grid_size, i * grid_size);
        let n = pnoise.simplex2(j/x_damp, i/y_damp);
        n += 0.5*pnoise.simplex2(j/(x_damp/2),i/(y_damp/2));
        const angle = max_angle * map(n, -1.5, 1.5, -1,1);
        rotate(angle);
        rect(0,0, grid_size*length_mult, grid_size);

        pop();
      }
    }
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
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