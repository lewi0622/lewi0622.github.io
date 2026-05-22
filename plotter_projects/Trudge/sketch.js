'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

// TODO don't draw items that go outside the canvas boundary
  // to reduce chopped off trees/shadows

let col_step, row_step, last_boot_pt, last_boot_tile, boot_spacing, boot_count, weight;

function gui_values(){
  parameterize("cols", floor(base_x * random(1/8, 1/2)), 1, base_x, 1, false);
  parameterize("rows", floor(base_y * random(1/8, 1/2)), 1, base_y, 1, false);
  parameterize("shadow_angle", random(-45,0) + random([0,-135]), -360, 0, 1, false);
  parameterize("shadow_len_pct", random(2,5), 0, 10, 0.1, false);
}

function setup() {
  common_setup();
  gui_values();
  // pixelDensity(10);

  boot_count = 0;
  last_boot_pt = {x: 0, y:0};
}
//***************************************************
function draw() {
  global_draw_start();
  //actual drawing stuff
  push();
  png_bg(false, color("WHITE"));
  weight = LEPEN * global_scale;
  strokeWeight(weight);

  col_step = width/cols;
  row_step = height/rows;

  boot_spacing = 0.9 * col_step;
  
  const tree_w = col_step;
  const tree_h = col_step * 3;

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

  let control_variation = w/4;
  let variation_dir = random(-1,1);
  
  control_variation *= variation_dir;
  
  const tree_c = color("#132e20");
  tree_c.setAlpha(200);
  stroke(tree_c);
  fill("WHITE");

  translate(w/2, -h/2);  
  while(w>0 && h>0){
    tree_outline(w, h, control_variation);
    control_variation = control_variation + variation_dir * -1 * weight;
    if(variation_dir < 0) control_variation = constrain(control_variation, -w, 0);
    else control_variation = constrain(control_variation, 0, w);
    w -= weight;
    h -= weight;
  }
}

function tree_outline(w,h,variation){
  beginShape();
  vertex(-w/2, h/2);
  bezierVertex(
    -w/2, h/2,
    variation,-h/2, 
    0,-h/2
  );
  bezierVertex(
    0,-h/2, 
    w/2 + variation, -h/2, 
    w/2, h/2
  );
  bezierVertex(
    w/2, h/2,
    0, h/2 + h/8,
    -w/2, h/2
  );
  endShape(CLOSE);
}

function mouseDragged(){
  boots(mouseX, mouseY);
}

function boots(x,y){
  //user-made boot trails
  const boot_c = color("BLACK");
  boot_c.setAlpha(150);
  stroke(boot_c);
  fill(boot_c);
  // on page
  if(x < 0 || x > canvas_x) return;
  if(y < 0 || y > canvas_y) return;

  //initial_click
  if(last_boot_pt.x == 0 && last_boot_pt.y == 0){
    last_boot_pt.x = x;
    last_boot_pt.y = y;
    return;
  }
  
  if(abs(dist(last_boot_pt.x, last_boot_pt.y, x, y)) < boot_spacing) return;

  //get angle from last tile to this one
  const prev = createVector(last_boot_pt.x, last_boot_pt.y);
  const next = createVector(x, y);

  const v  = p5.Vector.sub(next, prev);
  const boot_angle = v.heading();

  const boot_variation = 0.5;
  
  let w = col_step/3;
  let h = row_step/3;  
  
  push();

  x += w * boot_variation * random(-1,1);
  y += h * boot_variation * random(-1,1);

  translate(x, y);
  
  //center rotate about the gait
  translate(0, row_step/2);
  rotate(boot_angle);
  translate(0, -row_step/2);
  
  if(boot_count %2 == 0) translate(0, row_step);
  while(w > 0 && h > 0){
    ellipse(0, 0, w, h);
    w -= weight;
    h -= weight;
  }
  pop();

  last_boot_pt.x = x;
  last_boot_pt.y = y;
  boot_count++;
}