'use strict';
//setup variables
const gif = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
let suggested_palette;

//project variables
let grid_size;


function gui_values(){
  parameterize("weight", ceil(random(1,5)), 0.1, 50, 0.25, true);
  parameterize("grid_divisor", floor(random(4,16)), 1, 32, 1,false);
  parameterize("cutout", random([0,1,1,1]), 0, 1, 1, false);
}

function setup() {
  suggested_palette = random([SAGEANDCITRUS, GAMEDAY, BIRDSOFPARADISE]);
  common_setup(gif);
  colorMode(HSB);
}
//***************************************************
function draw() {
  capture_start(capture);
  clear();

  let tiles = [];
  //params
  let smaller_cnv = canvas_x;
  if(canvas_x>canvas_y){
    smaller_cnv = canvas_y;
  }

  grid_size = smaller_cnv/grid_divisor;

  const max_rows = round(canvas_y/grid_size);
  const max_cols = round(canvas_x/grid_size);

  const rows = ceil(random(max_rows));
  const cols = ceil(random(max_cols));

  let bound = (max_rows+max_cols)/(rows + cols);
  bound = constrain(bound, 5, 50);
  const iterations = floor(random(bound, 50) * 40*global_scale/grid_size);
  print(bound, iterations)

  refresh_working_palette();
  working_palette.forEach((e,idx) => {
    working_palette[idx] = RGBA_to_HSBA(...e);
  });
  let bg_c = random(working_palette);
  reduce_array(working_palette, bg_c);
  
  let c_primary = random(working_palette);
  reduce_array(working_palette, c_primary);

  //create tiles and starting locations
  let c = random(working_palette);
  for(let i=0; i<cols; i++){

    tiles.push({
      x: i*grid_size, 
      y: 0, 
      dir: "down", 
      c:c});
    tiles.push({
      x: (i+1)*grid_size, 
      y: max_rows*grid_size, 
      dir: "up", 
      c:c});
  }
  if(random()>0.75){
    c = random(working_palette);
  }

  for(let i=0; i<rows; i++){

    tiles.push({
      x: 0, 
      y: (i+1)*grid_size, 
      dir: "right", 
      c:c});
    tiles.push({
      x: max_cols*grid_size, 
      y: i*grid_size, 
      dir: "left", 
      c:c});
  }
  tiles.forEach(e => {
    e.draw = true;
  });

  //calculate number of lines per grid space
  let start = 0;
  let num_arcs = 0;
  while(start<grid_size/2){
    num_arcs+=4;
    start += weight*2;
  }
  num_arcs -=3; 

  //bleed
  const bleed_border = apply_bleed();
  
  //round is the only way to not have weird artifacts on the last tiles placed
  strokeCap(ROUND)

  //apply background  
  background(bg_c)

  //actual drawing stuff
  push();
  let z = 0;
  let draw_shape = true;
  while(z<iterations || draw_shape){
    stroke(c_primary);
    strokeWeight(weight);
    noFill();
    tiles = shuffle(tiles,true, max_cols+max_rows);
    for(let i =0; i<tiles.length; i++){
      push();
      const tile = tiles[i];
      const c_secondary = tile.c;

      translate(tile.x + grid_size/2, tile.y + grid_size/2);
      const dir = random(['straight', 'left', 'right']);

      //break after random call if no draw
      if(!tile.draw){
        pop();
        break;
      }

      switch(tile.dir){
        case "up":
          if(dir=='left'){rotate(180)}
          rotate(180);
          break;
        case "left":
          if(dir=='right'){rotate(180);}
          rotate(-90);
          break;
        case "right":
          if(dir=='right'){rotate(180)}
          rotate(90);
          break;
        default:
          if(dir=='left'){rotate(180)}
          break;
      }
      if(dir != 'straight'){
        if(dir == 'left'){
          rotate(-90);
        }
        const offset = (grid_size - num_arcs*weight);
        for(let j=0; j<num_arcs; j++){
          push();
          translate(-grid_size/2, -grid_size/2);
          if(j%2==0){
            stroke(c_primary);
          }
          else{
            stroke(c_secondary);
          }
          const diameter = offset+weight*(num_arcs-j)*2-weight;

          arc(0,0, diameter, diameter, 0, 90);
          pop();
        }
        
        switch(tile.dir){
          case "up":
            if(dir == 'left'){tile.dir = "left";}
            else{tile.dir = "right";}
            break;
          case "left":
            if(dir == 'left'){tile.dir = "down";}
            else{tile.dir = "up";}
            break;
          case "right":
            if(dir == 'left'){tile.dir = "up";}
            else{tile.dir = "down";}
            break;
          default:
            if(dir == 'left'){tile.dir = "right";}
            else{tile.dir = "left";}
            break;
        }
      }
      else{
        start = 0;
        while(start<grid_size/2){
          push();
          translate(start, 0);
          line(0,-grid_size/2,0,grid_size/2)
          stroke(c_secondary);
          line(-weight, -grid_size/2, -weight, grid_size/2);
          pop();
          push();
          translate(-start, 0);
          line(0,-grid_size/2,0,grid_size/2)
          stroke(c_secondary)
          line(weight, -grid_size/2, weight, grid_size/2);
          pop();
          start+=weight*2;
        }
      }

      switch(tile.dir){
        case "up":
          tile.y -= grid_size;
          break;
        case "left":
          tile.x -= grid_size;
          break;
        case "right":
          tile.x += grid_size;
          break;
        default:
          tile.y += grid_size;
          break;
      }
      pop();
    }

    if(z>=iterations){
      tiles = rm_tiles_OOB(tiles);
      //check if all are no-draw
      draw_shape = !tiles.every(function(e) {return !e.draw;})
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

  //cutlines
  apply_cutlines(bleed_border);
  capture_frame(capture);
}
//***************************************************
//custom funcs
function rm_tiles_OOB(tiles){
  for(let i=0; i<tiles.length; i++){
    let x = round(tiles[i].x);
    let y = round(tiles[i].y);
    if(tiles[i].draw){
      if(x<-grid_size/2 || x>canvas_x+grid_size/2 || y<-grid_size/2 || y>canvas_y+grid_size/2){
        tiles[i].draw=false;
      }
    }

  }
  return tiles;
}