'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

//ideas:
//house in clearing? find noise val furthest from tree range
//road, river, ski trail, boot trail (ovals)

let house_w, house_h, col_step, row_step, boot_map, last_boot_tile;

function gui_values(){
  parameterize("cols", floor(base_x/2), 1, base_x, 1, false);
  parameterize("rows", floor(base_y/2), 1, base_y, 1, false);
  parameterize("shadow_angle", random(-45,0) + random([0,-135]), -360, 0, 1, false);
  parameterize("shadow_len_pct", random(2,5), 0, 10, 0.1, false);
}

function setup() {
  common_setup();
  gui_values();
  boot_map = [];
  for(let i=0; i<cols; i++){
    const column = [];
    for(let j=0; j<rows; j++){
      column.push(0);
    }
    boot_map.push(column);
  }
  last_boot_tile = {col: -1, row: -1, angle:0};
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  png_bg(false, color("WHITE"));
  strokeWeight(LEPEN * global_scale);

  col_step = width/cols;
  row_step = height/rows;
  
  const tree_w = col_step;
  const tree_h = row_step * 3;

  house_w = tree_w * 8;
  house_h = tree_h * 2.5;

  const pct_move = 1;
  const min_w = 0.5;
  const max_w = 2;
  const min_h = 0.5;
  const max_h = 3;
  
  const upper_limit = 0.4;
  const lower_limit = 0.38;

  for(let k=0; k<2; k++){
    for(let i=0; i<cols; i++){
      for(let j=0; j<rows; j++){
        push();
        translate(i * col_step, j * row_step);
        const n = noise(i/10, j/10);
        const lerped_limit = lerp(upper_limit, lower_limit, j/rows);
        if((n < upper_limit && n > lerped_limit)){
          translate(tree_w * map(noise(i,j), 0,1,-pct_move,pct_move), tree_h * map(noise(j, i), 0,1,-pct_move,pct_move));
          
          const w = tree_w * map(noise(i,j), 0,1, 1-min_w, 1+max_w);
          const h = tree_h * map(noise(i,j), 0,1, 1-min_h, 1+max_h);
          
          if(k==0){
            translate(w/2,0);
            shadow(w,h, shadow_len_pct);
          }
          else{
            rotate(random(-7,7));
            lumpy_tree(w,h);
          }

        }
        pop();
      }
    }
  }

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs
function shadow(w,h, pct, num_shadows = floor(random(2,10)), angle_variation=5){
  stroke("#71a4ca");
  for(let i=0; i<num_shadows; i++){
    push();
    translate(0, lerp(0, -h/2, i/num_shadows));
    rotate(shadow_angle);
    rotate(random(-angle_variation,angle_variation));
    pct *= random(0.9,1.1);
    line(0,0,w*pct, 0);
    pop();
  }
}


function lumpy_tree(w, h){
  //start in lower left

  const control_variation = w/2 * random(-1,1);
  
  stroke("#132e20");
  fill("#132e20");
  beginShape();
  vertex(0,0);
  bezierVertex(
    0,0, 
    control_variation,-h, 
    w/2,-h
  );
  bezierVertex(
    w/2,-h, 
    w + control_variation, -h, 
    w, 0
  );
  bezierVertex(
    w,0,
    w/2, h/8,
    0,0
  );
  endShape(CLOSE);
  
  // boughs(w,h);
}

function boughs(w,h){
  push();
  translate(w/2,0);
  const num_steps = 40;
  const step_size = -h/num_steps;
  const noise_offset = random(100);
  for(let i=0; i<num_steps; i++){
    for(let j=0; j<2; j++){
      push();
      rotate(random(-5,5));
      stroke(random(["#132e20", "#1db638"]));
      translate(0, i * step_size);
      const bough_w = lerp(w, w/4, i/num_steps) * map(noise(noise_offset + i/10, j), 0,1, 0.5,1.5);
      if(j==0) line(0,0, bough_w,0);
      else line(-bough_w, 0, 0, 0);
      pop();
    }
  }
  pop();
}

function mouseDragged(){
  const col = floor(mouseX / col_step);
  const row = floor(mouseY / row_step);
  boots(col, row);
}

function boots(c, r){
  //user-made boot trails
  
  // on page
  if(c < 0 && c >= cols) return;
  if(r < 0 && r >= rows) return;

  //don't place in the same tile twice in a row
  if(last_boot_tile.col == c && last_boot_tile.row == r) return;

  //initial_click
  if(last_boot_tile.col == -1 && last_boot_tile.row == -1){
    last_boot_tile.col = c;
    last_boot_tile.row = r;
    return;
  }

  //get angle from last tile to this one
  const prev = createVector(last_boot_tile.col * col_step, last_boot_tile.row * row_step);
  const next = createVector(c * col_step, r * row_step);
  angleMode(DEGREES);
  const v  = p5.Vector.sub(next, prev);
  const boot_angle = lerp(last_boot_tile.angle, v.heading(), 0.25);

  //prolly need to lerp angle

  push();
  translate(c * col_step, r * row_step);
  rotate(boot_angle);
  ellipse(col_step/4, row_step/4, col_step/4, row_step/4);
  ellipse(col_step*3/4, row_step*3/4, col_step/4, row_step/4);
  pop();

  last_boot_tile.col = c;
  last_boot_tile.row = r;
  last_boot_tile.angle = boot_angle;
}

// function mouseClicked(){
//   house(mouseX, mouseY);
// }

// function house(x,y){
//   //starting bottom left
//   const w = house_w;
//   const h = house_h;
//   stroke("BLACK");
//   fill("WHITE");
//   push();
//   translate(x,y);

//   //front wall
//   beginShape();
//   vertex(0, -h * 1/5); //lower left
//   vertex(0, -h* 3/5); //upper left
//   vertex(w * 2/3, -h * 2/5); //upper right
//   vertex(w * 2/3, 0); //lower right
//   endShape(CLOSE);

//   //side wall
//   beginShape();
//   vertex(w * 2/3, 0); //lower left
//   vertex(w * 2/3, -h * 2/5); //upper left
//   vertex(w * 4/5, -h * 4/5); //roof tip
//   vertex(w, -h * 3/5); //upper right
//   vertex(w, -h * 1/5); //lower right
//   endShape(CLOSE);

//   //roof
//   beginShape();
//   vertex(0, -h* 3/5); //lower left
//   vertex(w * 1/3, -h * 9/10); //upper left
//   vertex(w * 4/5, -h * 4/5); //upper right
//   vertex(w * 2/3, -h * 2/5); //lower right
//   endShape(CLOSE);

//   const roof_hatch = 10;
//   for(let i=0; i<roof_hatch-1; i++){
//     const pct = (i+1)/roof_hatch;
//     const start_x = lerp(0, w * 2/3, pct);
//     const ending_x = lerp(w*1/3, w *4/5, pct);
//     const start_y = lerp(-h*3/5, -h*2/5, pct);
//     const ending_y = lerp(-h *9/10, -h* 4/5, pct);
//     line(start_x, start_y, ending_x, ending_y)
//   }

//   pop();
// }