gif = false;
fr = 0.5;

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
  grid_size = round(random([2,4,6,8,10])*10*global_scale);

  weight = ceil(random(1,5)*global_scale);

  max_rows = floor(canvas_y/grid_size);
  max_cols = floor(canvas_x/grid_size);

  rows = ceil(random(max_rows));
  cols = ceil(random(max_cols));

  bound = (max_rows+max_cols)/(rows + cols);
  bound = constrain(bound, 5, 50);
  iterations = floor(random(bound, 50) * 40*global_scale/grid_size);

  for(let i=0; i<cols; i++){
    tiles.push({x: i*grid_size, y: 0, dir: "down"});
    tiles.push({x: (i+1)*grid_size, y: max_rows*grid_size, dir: "up"});
  }
  for(let i=0; i<rows; i++){
    tiles.push({x: 0, y: (i+1)*grid_size, dir: "right"});
    tiles.push({x: max_cols*grid_size, y: i*grid_size, dir: "left"});
  }

  start = 0;
  num_arcs = 0;
  while(start<grid_size/2){
    num_arcs+=4;
    start += weight*2;
  }
  num_arcs -=3; 

  //bleed
  bleed_border = apply_bleed();

  working_palette = JSON.parse(JSON.stringify(palette));
  strokeCap(ROUND)

  bg_c = random(working_palette);
  reduce_array(working_palette, bg_c);
  
  c_primary = random(working_palette);
  reduce_array(working_palette, c_primary);
  c_secondary = random(working_palette);

  bg_c = RGBA_to_HSBA(...bg_c);
  c_primary = RGBA_to_HSBA(...c_primary);
  c_secondary = RGBA_to_HSBA(...c_secondary);
  //apply background  
  background(bg_c)

  //highlight color
  // tiles[floor(random(tiles.length))].h = true;
  // c_hl = RGBA_to_HSBA(...random(working_palette));

  //actual drawing stuff
  push();

  for(let z=0; z<iterations; z++){
    // if(z+1>=iterations){
    //   strokeCap(ROUND)
    // }
    stroke(c_primary);
    strokeWeight(weight);
    noFill();
    tiles = shuffle(tiles);
    for(let i =0; i<tiles.length; i++){
      push();
      translate(tiles[i].x + grid_size/2, tiles[i].y + grid_size/2);
      dir = random(['straight', 'left', 'right']);
      switch(tiles[i].dir){
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
        
        switch(tiles[i].dir){
          case "up":
            if(dir == 'left'){tiles[i].dir = "left";}
            else{tiles[i].dir = "right";}
            break;
          case "left":
            if(dir == 'left'){tiles[i].dir = "down";}
            else{tiles[i].dir = "up";}
            break;
          case "right":
            if(dir == 'left'){tiles[i].dir = "up";}
            else{tiles[i].dir = "down";}
            break;
          default:
            if(dir == 'left'){tiles[i].dir = "right";}
            else{tiles[i].dir = "left";}
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

      switch(tiles[i].dir){
        case "up":
          tiles[i].y -= grid_size;
          break;
        case "left":
          tiles[i].x -= grid_size;
          break;
        case "right":
          tiles[i].x += grid_size;
          break;
        default:
          tiles[i].y += grid_size;
          break;
      }
      pop();
    }
  }
  pop();
  //cutlines
  apply_cutlines();
  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs

function highlight(tile){
  if(tile.h){
    stroke(c_hl);
  }
}