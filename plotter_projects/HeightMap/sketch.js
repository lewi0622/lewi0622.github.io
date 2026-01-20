'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 10;
const capture = false;
const capture_time = 20;

const suggested_palettes = [SOUTHWEST];
let dark_c1, dark_c2, light_c1, light_c2;

function gui_values(){
  parameterize("margin_x", base_x/8, -base_x/2, base_x/2, 1, true);
  parameterize("margin_y", base_y/8, -base_y/2, base_y/2, 1, true);
  parameterize("columns", 20, 1, 50, 1, false);
  parameterize("rows", 20, 1, 50, 1, false);  
  parameterize("damp", 20, 1, 500, 1, false);
  parameterize("particle_count", 100, 0, 1000, 1, false);
  parameterize("erode_amount", 0.05, 0.01, 1, 0.01, false);
  parameterize("squig_steps", 10, 1, 100, 1, false);
  parameterize("squigs_per_tile", 3, 1, 100, 1, false);
  squigs_per_tile = round(squigs_per_tile);
  parameterize("tightness", 0, -5,5,0.1, false);
}

function setup() {
  common_setup();
  gui_values();
  noFill();
}
//***************************************************
function draw() {
  global_draw_start();
  push();
  noFill();
  // squig_steps = map(sin(frameCount*50), -1, 1, 7, 10);

  background(working_palette[2]);

  for(let i=0; i<working_palette.length; i++){
    const c = color(working_palette[i]);
    c.setAlpha(200);
    working_palette[i] = c;
  }

  dark_c1 = random(working_palette);
  reduce_array(working_palette, dark_c1);
  dark_c2 = random(working_palette);
  reduce_array(working_palette, dark_c2);
  light_c1 = random(working_palette);
  reduce_array(working_palette, light_c1);
  light_c2 = random(working_palette);
  reduce_array(working_palette, light_c2);
  
  //grid size
  const column_size = (canvas_x - margin_x) / columns;
  const row_size = (canvas_y - margin_y) / rows;

  //create noise based height map
  const height_map = create_height_map(columns, rows);
  
  //iteratively drop "particles" randomly
  for(let i=0; i<particle_count; i++){
    drop_particle(height_map);
  }

  draw_height_map(height_map, column_size, row_size); 
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
function squigs(w, h, n){
  //draws n squiggles
  const height_step = h / n;
  for(let i=0; i<n; i++){
    push();
    translate(0, i * height_step);
    squig(w, height_step, squig_steps);
    pop();
  }
}

function squig(max_x, max_y, iterations){
  //creates squiggles within max vals
  noFill();
  const x_vals = [0, max_x/2, max_x, max_x/2];
  curveTightness(tightness);
  beginShape();
  for(let i=0; i<iterations; i++){
    const x = x_vals[i%x_vals.length] + 0.1 * random(max_x);
    const y = random(max_y);
    curveVertex(x,y);
  }
  endShape();
}


function create_height_map(columns, rows){
  let height_map = [];
  for(let j=0; j<rows; j++){
    const row = [];
    for(let i=0; i<columns; i++){
      let noise_val = pnoise.simplex3((i+1)/damp, (j+1)/damp, frameCount/20);
      // noise_val += 0.5 * pnoise.simplex3(2*(i+1)/damp, 2*(j+1)/damp, frameCount/20); //Unsure if adding octaves of simples makes sense like it does for perlin
      // noise_val += 0.25 * pnoise.simplex3(4*(i+1)/damp, 4*(j+1)/damp, frameCount/20);
      // noise_val = map(noise_val, -1.75, 1.75, 0, 1);
      noise_val = map(noise_val, -1,1, 0,1);
      row.push(noise_val);
    }
    height_map.push(row);
  }

  //renormalize to 0,1 range
  renorm_heights(height_map);

  return height_map;
}

function draw_height_map(height_map, column_size, row_size){
  translate(margin_x/2, margin_y/2);
  for(let j=0; j<rows; j++){
    let last_color, last_direction;
    for(let i=0; i<columns; i++){
      push();
      const h = height_map[j][i];
      const x = i * column_size;
      const y = j * row_size;
      translate(x,y);

      translate(column_size/2, row_size/2);

      translate(map(pnoise.simplex2(j/50, frameCount/50), -1,1, -column_size*2, column_size*2), map(h, 0,1, -row_size*4, row_size*4));

      const dir = get_direction(height_map, i, j);
      //negative dir is in shadow
      let c;
      if(dir < 0) c = lerpColor(dark_c1, dark_c2, h);
      else c = lerpColor(light_c1, light_c2, h);

      if(last_color != undefined){
        const direction_changed = (dir < 0 && last_direction >= 0) || (dir >= 0 && last_direction < 0);
        if(direction_changed){
          c = lerpColor(last_color, c, 0.5);
        }
      }
      last_direction = dir;
      last_color = c;

      stroke(c);

      rotate(dir*10);
      translate(-column_size/2, -row_size/2);

      const squiggle_width = column_size*2;
      const squiggle_height = row_size*2;
      translate((column_size - squiggle_width)/2, (row_size - squiggle_height)/2);

      squigs(squiggle_width, squiggle_height, squigs_per_tile);

      pop();
    }
  }
}

function renorm_heights(height_map){
  const [min_height, max_height] = get_min_max_heights(height_map);
  for(let j=0; j<rows; j++){
    for(let i=0; i<columns; i++){
      const h = height_map[j][i];
      height_map[j][i] = norm(h, min_height, max_height);
    }
  }
}

function get_min_max_heights(height_map){
  let min_height = height_map[0][0];
  let max_height = height_map[0][0];
  for(let j=0; j<rows; j++){
    for(let i=0; i<columns; i++){
      const h = height_map[j][i];
      if(h < min_height) min_height = h;
      if(h > max_height) max_height = h;
    }
  }
  return [min_height, max_height];
}


function get_direction(height_map, x, y){
  //compares the height of the neighboring cells and returns angle
  const h = height_map[y][x];
  let left_h = height_map[y][x-1];
  if(left_h === undefined) left_h = h;
  let right_h = height_map[y][x+1];
  if(right_h === undefined) right_h = h;

  if(h < left_h && h < right_h){ //trough
    return 0;
  } else if(h > left_h && h > right_h){ //peak
    return 180;
  } else {
    return map(left_h-right_h, -1,1, -90, 90);
  }
}

function drop_particle(height_map, start_x, start_y){
  //pick random starting location
  if(start_x === undefined && start_y === undefined){
    start_x = floor(random(columns)); 
    start_y = floor(random(rows));
    height_map[start_y][start_x] -= erode_amount;
  }

  const [lowest_x, lowest_y] = get_lowest_neighbor(height_map, start_x, start_y);

  if(lowest_x == start_x && lowest_y == start_y){
    //deposit erode amount
    height_map[start_y][start_x] += erode_amount;
    return;
  } 
  drop_particle(height_map, lowest_x, lowest_y);
  return;

}

function get_lowest_neighbor(height_map, x, y){
  let lowest_x = x;
  let lowest_y = y;
  let lowest_val = height_map[y][x];
  //get left neighbor
  const left_height = height_map[y][(x-1 + columns) % columns];
  if(left_height < lowest_val){
    lowest_x = (x-1 + columns) % columns;
    lowest_y = y;
    lowest_val = left_height;
  }
  //get right neighbor
  const right_height = height_map[y][(x+1) % columns];
  if(right_height < lowest_val){
    lowest_x = (x+1) % columns;
    lowest_y = y;
    lowest_val = right_height;
  }
  //get top neighbor
  const top_height = height_map[(y-1 + rows) % rows][x];
  if(top_height < lowest_val){
    lowest_x = x;
    lowest_y = (y-1 + rows) % rows;
    lowest_val = top_height;
  }
  //get bottom neighbor
  const bottom_height = height_map[(y+1) % rows][x];
  if(bottom_height < lowest_val){
    lowest_x = x;
    lowest_y = (y+1) % rows;
    lowest_val = bottom_height;
  }

  return [lowest_x, lowest_y];
}