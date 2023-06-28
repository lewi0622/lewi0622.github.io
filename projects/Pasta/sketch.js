'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
suggested_palettes = [SAGEANDCITRUS, GAMEDAY, BIRDSOFPARADISE]

//project variables
let grid_size, line_padding, num_arcs, c_arr;

function gui_values(){
  parameterize("weight", ceil(random(1,6)), 0.1, 50, 0.25, true);
  parameterize("grid_divisor", floor(random(2,16)), 1, 32, 1,false);
  parameterize("cutout", random([0,1,1,1]), 0, 1, 1, false);
  parameterize("force_type", 0, 0, 5, 1, false); //0 is do not force, any other val picks from ["Normal", "Rand", "Hue", "Sat", "Bri"]
}

function setup() {
  common_setup();
  colorMode(HSB);
}
//***************************************************
function draw() {
  global_draw_start();

  //empty tiles array
  let tiles = [];

  //find the smaller dimension
  let smaller_cnv = canvas_x;
  if(canvas_x>canvas_y){
    smaller_cnv = canvas_y;
  }

  //set grid size based on smallest dim
  grid_size = smaller_cnv/grid_divisor;

  const max_rows = round(canvas_y/grid_size);
  const max_cols = round(canvas_x/grid_size);

  const rows = ceil(random(max_rows));
  const cols = ceil(random(max_cols));

  let bound = (max_rows+max_cols)/(rows + cols);
  bound = constrain(bound, 5, 50);
  const iterations = floor(random(bound, 50) * 40*global_scale/grid_size);
  refresh_working_palette();

  //convert working palette to use HSBA
  working_palette.forEach((e,idx) => {
    working_palette[idx] = RGBA_to_HSBA(...e);
  });

  const bg_c = random(working_palette);
  reduce_array(working_palette, bg_c);
  
  const c_primary = random(working_palette);
  reduce_array(working_palette, c_primary);

  const c_secondary = random(working_palette);

  //all startings tiles have their origins off screen, but point towards on screen
  for(let i=0; i<cols; i++){
    // tiles along the top
    tiles.push({
      x: ceil(random(max_cols)), 
      y: 0,
      previous: "down", 
      facing: "down"});
    //tiles along the bottom
    tiles.push({
      x: ceil(random(max_cols)), 
      y: max_rows+1,
      previous: "up",  
      facing: "up",
      swapped: false});
  }

  for(let i=0; i<rows; i++){
    // tiles along the left
    tiles.push({
      x: -1, 
      y: ceil(random(max_rows)), 
      previous: "right", 
      facing: "right"});
    //tiles along the right
    tiles.push({
      x: max_cols, 
      y: ceil(random(max_rows)), 
      previous: "left", 
      facing: "left"});
  }
  //set each tile with draw flag set True
  tiles.forEach(e => {
    e.draw = true;
  });
  //calculate number of lines per grid space
  num_arcs = 0;
  let start = 0;
  while(start<grid_size/2){
    num_arcs+=4;
    start += weight*2;
  }
  num_arcs -=3; 

  //line padding, space between grid size and size of all lines
  line_padding = grid_size-num_arcs*weight + weight;

  //create color array
  c_arr = [];
  let c_type = random(["Normal", "Rand", "Hue", "Sat", "Bri"]);
  if(force_type != 0) c_type = ["Normal", "Rand", "Hue", "Sat", "Bri"][force_type-1];
  for(let i=0; i<num_arcs; i++){
    let c_to_add;
    const rand_color = random(working_palette);
    if(i%2 == 0) c_to_add = c_primary;
    else{
      let c_copy = JSON.parse(JSON.stringify(c_secondary));
      if(c_type == "Hue") {c_copy[0] += 10*i; c_copy[0] = c_copy[0]%360}
      else if(c_type == "Sat") c_copy[1] *= map(i/num_arcs, 0,1, 0.25, 2);
      else if(c_type == "Bri") c_copy[2] *= map(i/num_arcs, 0,1, 0.25, 1.5);
      else if(c_type == "Rand") c_copy = rand_color;
      c_to_add = c_copy;
    }
    c_to_add = color(c_to_add);
    c_arr.push(c_to_add)
  }

  
  //round is the only way to not have weird artifacts on the last tiles placed
  strokeCap(ROUND)

  //apply background  
  background(bg_c)

  //actual drawing stuff
  push();
  let z = 0;
  let draw_paths = true;
  strokeWeight(weight);
  noFill();

  while(z<iterations || draw_paths){
    tiles = shuffle(tiles,true, max_cols+max_rows);
    for(let i =0; i<tiles.length; i++){
      push();

      const current_tile = tiles[i];
      //move to tile location
      translate(current_tile.x*grid_size, current_tile.y*grid_size);

      if(!current_tile.draw){
        pop();
        continue;
      }

      //draw tile
      if(current_tile.previous == current_tile.facing) current_tile.swapped = draw_lines(current_tile.facing, current_tile.swapped);
      else current_tile.swapped = draw_arcs(current_tile.previous, current_tile.facing, current_tile.swapped);
      //save facing to previous
      current_tile.previous = current_tile.facing;
      //move coordinates based on facing
      if(current_tile.facing == "up")current_tile.y--;
      if(current_tile.facing == "down")current_tile.y++;
      if(current_tile.facing == "left")current_tile.x--;
      if(current_tile.facing == "right")current_tile.x++;
      //pick new direction
      current_tile.facing = pick_new_dir(current_tile.facing);
      pop();
    }
      
    if(z>=iterations){
      tiles = rm_tiles_OOB(tiles);
      //check if all are no-draw
      draw_paths = !tiles.every(function(e) {return !e.draw;})
    }

    //loop cleanup
    z++;
  }

  pop();

  if(cutout){
    push();
    //cutout
    noFill();
    if(capture){stroke("WHITE");}
    else{erase();}
    strokeWeight(grid_size);
    rect(0,0, canvas_x, canvas_y, grid_size);
  
    noErase();
    strokeWeight(5*global_scale);
    stroke(bg_c)
    rect(grid_size/2, grid_size/2, canvas_x-grid_size, canvas_y-grid_size, grid_size/2);
  
    pop();
  }
  
  global_draw_end();
}
//***************************************************
//custom funcs
function rm_tiles_OOB(tiles){
  for(let i=0; i<tiles.length; i++){
    let x = round(tiles[i].x*grid_size);
    let y = round(tiles[i].y*grid_size);
    if(tiles[i].draw){
      if(x<-grid_size/2 || x>canvas_x+grid_size/2 || y<-grid_size/2 || y>canvas_y+grid_size/2){
        tiles[i].draw=false;
      }
    }
  }
  return tiles;
}

function draw_lines(facing, swapped){
  // draw straight lines
  //rotate for facing
  translate(grid_size/2, -grid_size/2);
  if(facing == "down") rotate(180);
  else if(facing == "left") rotate(90);
  else if(facing == "right") rotate(270);
  translate(-grid_size/2, grid_size/2);
  //move in by line padding
  translate(line_padding/2,0);
  if((!swapped && facing == "right") ||
  (!swapped && facing == "left") ||
  (swapped && facing == "up") ||
  (swapped && facing == "down")) swapped = !swapped;

  for(let j=0; j<num_arcs; j++){
    if(swapped) stroke(c_arr[num_arcs-j-1]);
    else stroke(c_arr[j]);
    line(j*weight,0, j*weight, -grid_size);
  }
}

function draw_arcs(previous, facing, swapped){
  // draw arcs
  const offset = (grid_size - num_arcs*weight);
  translate(grid_size/2, -grid_size/2);
  //default case is (previous == "up" && facing == "left" || previous == "right" && facing == "down")
  if(previous == "right" && facing == "up" || previous == "down" && facing == "left") rotate(90)
  else if(previous == "down" && facing == "right" || previous == "left" && facing == "up") rotate(180)
  else if(previous == "left" && facing == "down" || previous == "up" && facing == "right") rotate(270)
  translate(-grid_size/2, grid_size/2);
  if(clock_wise(previous, facing)) swapped = true;
  else swapped = false;

  for(let j=0; j<num_arcs; j++){
    if(swapped) stroke(c_arr[num_arcs-j-1]);
    else stroke(c_arr[j]);

    const diameter = offset+weight*(num_arcs-j)*2-weight;

    arc(0,0, diameter, diameter, -90,0);
  }
  return swapped;
}

function pick_new_dir(facing){
  //based on existing direction, pick next direction 
  if(facing == "up") return random(["up", "left", "right"]);
  if(facing == "down") return random(["down", "left", "right"]);
  if(facing == "right") return random(["up", "down", "right"]);
  if(facing == "left") return random(["up", "left", "down"]);
}

function clock_wise(previous, facing){
  return (previous == "up" && facing == "left") ||
  (previous == "left" && facing == "down") ||
  (previous == "down" && facing == "right") ||
  (previous == "right" && facing == "up")
}