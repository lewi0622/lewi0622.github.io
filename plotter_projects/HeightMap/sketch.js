'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 10;
const capture = false;
const capture_time = 5;

const suggested_palettes = [COTTONCANDY, GAMEDAY, BIRDSOFPARADISE, SOUTHWEST, SUPPERWARE, JAZZCUP];
let dark_c1, dark_c2, light_c1, light_c2, squig_steps;

function gui_values(){
  parameterize("margin_x", base_x/4, -base_x/2, base_x/2, base_x/16, true);
  parameterize("margin_y", base_y/4, -base_y/2, base_y/2, base_y/16, true);

  const r = round(random(base_x/8,base_x/2));
  const c = round(random(base_x/8,r));

  parameterize("columns", c, 1, base_x/2, 1, false);
  parameterize("rows", r, 1, base_y/2, 1, false);  

  const x_d = random(10,50);
  const y_d = random(10, x_d);

  parameterize("x_damp", x_d, 1, 200, 1, false);
  parameterize("y_damp", y_d, 1, 200, 1, false);
  parameterize("squigs_per_tile", 4, 1, 30, 1, false);
  parameterize("y_height_mult", random(0.05, 0.2), -0.2, 0.2, 0.01, false);
  parameterize("erode_amount", 0.05, 0.01, 1, 0.01, false);
  parameterize("tightness", 0, -5,5,0.1, false);
  parameterize("blend_colors", 0, 0, 1, 1, false);
  parameterize("debug", 0, 0, 1, 1, false);
}

//consider controlling for max distance from previous pt
//for each pt (except first row) look up prev pt above and 
//only allow a max movement to reduce gapping in highly vertical designs

//something to think about is when the same color is selected for both darks or both lights, 
// changing one of the colors would result in slightly more nuance, see cottoncandy 3,1,0,0

//to make plottable add option to swap between lerpColor and manually blending amt of each color in each tile
//so lerp, not between colors, but proportion of c1/c2

function setup() {
  common_setup();
  gui_values();
  noFill();

  for(let i=0; i<working_palette.length; i++){
    const c = color(working_palette[i]);
    c.setAlpha(150);
    if(type == "svg") c.setAlpha(BICCRISTAL_ALPHA);
    working_palette[i] = c;
  }

  let selected_colors;

  if(global_palette_id == SOUTHWEST){ //fall
    const good_palettes = [
      [2,0,4,1],
      [ 1, 4, 3, 0 ],
      [ 0, 1, 3, 0 ],
      [ 0, 2, 3, 1 ],
      [ 0, 1, 2, 0 ],
      [ 4, 1, 2, 0 ]
    ]
    selected_colors = random(good_palettes);
  } else if(global_palette_id == BIRDSOFPARADISE){
    const good_palettes = [
      [6,3,0,4],
      [7,5,0,4],
      [2,0,2,7],
      [0,4,3,5],
      [3,6,0,2]
    ]
    selected_colors = random(good_palettes);
  } else if(global_palette_id == COTTONCANDY){
    const good_palettes = [
      [3,1,0,0], //sunrise
      [1,3,3,0] //fall
    ]
    selected_colors = random(good_palettes);
  } else if(global_palette_id == GAMEDAY){
    const good_palettes = [
      [2,2,1,2], //winter
      [3,0,1,2], //winter
      [3,2,1,2] //winter
    ]
    selected_colors = random(good_palettes);
  } else if(global_palette_id == SUPPERWARE){
    const good_palettes = [
      [1,0,5,1],
      [5,3,0,0],
      [0,0,1,4] //sunset
    ]
    selected_colors = random(good_palettes);
  } else if(global_palette_id == JAZZCUP){ 
    const good_palettes = [
      [0,2,3,3] //winter
    ]
    selected_colors = random(good_palettes);
  } else{
    selected_colors = [
      floor(random(working_palette.length)),
      floor(random(working_palette.length)),
      floor(random(working_palette.length)),
      floor(random(working_palette.length))
    ]
  }
  print(selected_colors)
  dark_c1 = working_palette[selected_colors[0]];
  dark_c2 = working_palette[selected_colors[1]];
  light_c1 = working_palette[selected_colors[2]];
  light_c2 = working_palette[selected_colors[3]];

  // type = "svg"
  if(type == "svg"){
    dark_c1 = color(BIC_RED);
    dark_c1.setAlpha(BICCRISTAL_ALPHA);
    dark_c2 = color(BIC_BLACK);
    dark_c2.setAlpha(BICCRISTAL_ALPHA);
    light_c1 = color(BIC_LIGHTBLUE);
    light_c1.setAlpha(BICCRISTAL_ALPHA);
    light_c2 = color(BIC_TEAL);
    light_c2.setAlpha(BICCRISTAL_ALPHA);
  }

  noFill();
  // pixelDensity(15);
}
//***************************************************
function draw() {
  global_draw_start();
  push();

  if(type == "png") background("#dbc3a3");
  //grid size
  const column_size = (canvas_x - margin_x) / columns;
  const row_size = (canvas_y - margin_y) / rows;

  //squig defs
  const tile_size = max(column_size, row_size);
  squig_steps = 6//round(random(6,10) / 5 * tile_size);
  //squigs_per_tile = 10//round(random(6,random(6,30)) / 5 * tile_size); //six is kinda sparse, 30 is very lush
  // if(debug) squigs_per_tile = 4;
  strokeWeight(BICCRISTAL);
  if(type == "svg"){

    // squigs_per_tile = 20;
  }

  //create noise based height map
  const height_map = create_height_map(columns, rows);
  
  //iteratively drop "particles" randomly
  const particle_count = random(100, 2000) / 2500 * columns * rows;
  for(let i=0; i<particle_count; i++){
    drop_particle(height_map);
  }

  draw_height_map(height_map, column_size, row_size); 
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
function squigs(w, h, n, c1, c2, blend_pct){
  //draws n squiggles
  const height_step = h*2 / n;
  for(let i=0; i<n; i++){
    push();
    translate(0, i * height_step);
    if(true){
      stroke(c1);
      if(i/n > blend_pct) stroke(c2);
    }
    if(i/n < blend_pct){
      squig(w, height_step, squig_steps);
    }
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
    const x = x_vals[i%x_vals.length] +  random(max_x);
    const y = random(-max_y/2, max_y*1.5);
    curveVertex(x,y);
  }
  endShape();
}


function create_height_map(columns, rows){
  const h_map = [];
  for(let j=0; j<rows; j++){
    const row = [];
    for(let i=0; i<columns; i++){
      let noise_val = pnoise.simplex2((i+1)/x_damp, (j+1)/y_damp);
      noise_val = map(noise_val, -1,1, 0,1);
      row.push(noise_val);
    }
    h_map.push(row);
  }

  //renormalize to 0,1 range
  renorm_heights(h_map);

  return h_map;
}

function draw_height_map(height_map, column_size, row_size){
  translate(margin_x/2, margin_y/2);
  let max_h = 0;
  let min_h = 1;
  for(let j=0; j<rows; j++){
    let last_color, last_direction;
    const color_change_loops = 4; //minimum 2 to see anything
    let color_change_counter = color_change_loops;
    for(let i=0; i<columns; i++){
      push();
      const h = height_map[j][i];
      const x = i * column_size;
      const y = j * row_size;
      translate(x,y);

      translate(column_size/2, row_size/2);

      //warp
      const design_width = canvas_x - margin_x;
      const design_height = canvas_y - margin_y;
      const warp_x = 0.05 * design_width;
      const warp_y = y_height_mult * design_height;
      translate(map(pnoise.simplex2(j/50, 0), -1,1, -warp_x, warp_x), map(h, 0,1, -warp_y, warp_y));

      const dir = get_direction(height_map, i, j);
      //negative dir is in shadow
      let c;
      let c1 = light_c1;
      let c2 = light_c2;
      if(dir < 0){
        c1 = dark_c1;
        c2 = dark_c2;
      }
      c = lerpColor(c1, c2, h);
      if(min_h > h) min_h = h;
      if(max_h < h) max_h = h;

      if(last_color != undefined){
        const direction_changed = (dir < 0 && last_direction >= 0) || (dir >= 0 && last_direction < 0);
        if(direction_changed){
          //reset color_change_counter
          color_change_counter = 0;
        }
        if(color_change_counter < color_change_loops){ //blending over borders between light and dark
          c = lerpColor(last_color, c, color_change_counter * 1/color_change_loops);
          color_change_counter++;
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

      squigs(squiggle_width, squiggle_height, squigs_per_tile, c1, c2, h);
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