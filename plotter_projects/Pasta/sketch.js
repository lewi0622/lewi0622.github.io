'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
suggested_palettes = [LASER]

//project variables
let grid_size, line_padding, num_arcs, c_arr;
let pen_weight, fill_iterations;

function gui_values(){
  parameterize("weight", ceil(random(1,6)), 0.1, 50, 0.25, true);
  parameterize("grid_divisor", floor(random(2,16)), 1, 32, 1,false);
  parameterize("cutout", random([0,1,1,1]), 0, 1, 1, false);
}

function setup() {
  //7 inches * 96 = 672 px
  common_setup(gif, SVG, 672, 672);
  pen_weight = COPICMARKER;
  fill_iterations = ceil(weight/pen_weight);
  print(fill_iterations)
}
//***************************************************
function draw() {
  capture_start(capture);
  clear();

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
  
  const c_primary =  working_palette[0];
  const c_secondary = working_palette[1];

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
  for(let i=0; i<num_arcs; i++){
    let c_to_add;
    const rand_color = random(working_palette);
    if(i%2 == 0) c_to_add = c_primary;
    else c_to_add = c_secondary;
    c_to_add = color(c_to_add);
    c_arr.push(c_to_add)
  }
  //bleed
  const bleed_border = apply_bleed();
  
  //round is the only way to not have weird artifacts on the last tiles placed
  strokeCap(ROUND)

  //apply background  
  // background(bg_c)

  //actual drawing stuff
  push();
  let z = 0;
  let draw_paths = true;
  strokeWeight(pen_weight);
  fill(working_palette[working_palette.length-1]);

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
    rect(grid_size/2, grid_size/2, canvas_x-grid_size, canvas_y-grid_size, grid_size/2);
  
    pop();
  }
  
  //cutlines
  apply_cutlines(bleed_border);
  capture_frame(capture);
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
    for(let z=0; z<ceil(weight/pen_weight); z++){
      const rect_width = weight-pen_weight*z;
      const rect_height_adjust = pen_weight*z/2;
      rect(j*weight-rect_width/2,-rect_height_adjust, rect_width, -grid_size+rect_height_adjust*2);
    }
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

  for(let z=0; z<ceil(weight/pen_weight);z++){
    const arc_width = weight-pen_weight*z;
    const arc_size_adjust = pen_weight*z/2;
    for(let j=0; j<num_arcs; j++){
      if(swapped) stroke(c_arr[num_arcs-j-1]);
      else stroke(c_arr[j]);

      //radius points to the middle of the arc shape
      const radius = (offset+weight*(num_arcs-j)*2-weight)/2;
      const x1 = radius-arc_width/2;
      const y1 = arc_size_adjust;
      const x4 = arc_size_adjust;
      const y4 = radius-arc_width/2;

      beginShape();
      vertex(x1, y1);
      let control_points = bezier_arc_controls(0,0, x1, y1, x4, y4);
      bezierVertex(...control_points, x4, y4);
      vertex(x4, y4+arc_width);
      control_points = bezier_arc_controls(0,0, x4, y4+arc_width, x1+arc_width,y1);
      bezierVertex(...control_points, x1+arc_width, y1);
      endShape(CLOSE);
    }
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