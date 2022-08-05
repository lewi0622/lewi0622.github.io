gif = false;
fr = 1;

capture = false;
capture_time = 10;

function setup() {
  suggested_palette = random([SAGEANDCITRUS, GAMEDAY, BIRDSOFPARADISE]);
  // common_setup(gif, P2D, base_x=450, base_y=800);
  common_setup(gif);
  colorMode(HSB);
}
//***************************************************
function draw() {
  capture_start(capture);
  clear();

  tiles = [];
  //params
  smaller_cnv = canvas_x;
  if(canvas_x>canvas_y){
    smaller_cnv = canvas_y;
  }

  grid_size = smaller_cnv/floor(random(4,16));

  weight = ceil(random(1,5))*global_scale;

  max_rows = round(canvas_y/grid_size);
  max_cols = round(canvas_x/grid_size);

  rows = ceil(random(max_rows));
  cols = ceil(random(max_cols));

  bound = (max_rows+max_cols)/(rows + cols);
  bound = constrain(bound, 5, 50);
  iterations = floor(random(bound, 50) * 40*global_scale/grid_size);

  working_palette = JSON.parse(JSON.stringify(palette));
  working_palette.forEach((e,idx) => {
    working_palette[idx] = RGBA_to_HSBA(...e);
  });
  bg_c = random(working_palette);
  reduce_array(working_palette, bg_c);
  
  c_primary = random(working_palette);
  reduce_array(working_palette, c_primary);

  //create tiles and starting locations
  c = random(working_palette);
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
  start = 0;
  num_arcs = 0;
  while(start<grid_size/2){
    num_arcs+=4;
    start += weight*2;
  }
  num_arcs -=3; 

  //bleed
  bleed_border = apply_bleed();
  
  //round is the only way to not have weird artifacts on the last tiles placed
  strokeCap(ROUND)

  //apply background  
  background(bg_c)

  //actual drawing stuff
  push();
  let z = 0;
  let draw = true;
  while(z<iterations || draw){
    stroke(c_primary);
    strokeWeight(weight);
    noFill();
    tiles = shuffle(tiles,true, max_cols+max_rows);
    for(let i =0; i<tiles.length; i++){
      push();
      tile = tiles[i];
      c_secondary = tile.c;

      translate(tile.x + grid_size/2, tile.y + grid_size/2);
      dir = random(['straight', 'left', 'right']);

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
        dir_sign = 0;
        offset = (grid_size - num_arcs*weight);
        for(let j=0; j<num_arcs; j++){
          push();
          translate(-grid_size/2, -grid_size/2);
          if(j%2==0){
            stroke(c_primary);
          }
          else{
            stroke(c_secondary);
          }
          diameter = offset+weight*(num_arcs-j)*2-weight;

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
      draw = !tiles.every(function(e) {return !e.draw;})
    }

    //loop cleanup
    z++;
  }
  pop();
  //cutlines
  apply_cutlines(bleed_border);
  capture_frame(capture, num_frames);
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