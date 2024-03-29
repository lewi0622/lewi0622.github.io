'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [SAGEANDCITRUS, COTTONCANDY, SUPPERWARE]

function gui_values(){
  parameterize("num_pts", floor(random(6,60)), 4, 100, 1, false);
  parameterize("pt_size", floor(random(10,30)), 1, 100, 1, true);
  parameterize("weight", 4, 0.1, 20, 0.1, true);
  parameterize("multiply", 0, 0, 1, 1, false);
}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();
 
  //apply background
  background(working_palette[floor(random(working_palette.length))]);

  //actual drawing stuff
  push();
  //create series of points
  const pts = [];
  for(let i=0; i<num_pts; i++){
    const new_pt = gen_pt(pts, pt_size*2);
    pts.push(new_pt);
  }

  furthest_pts(pts);

  pts.forEach(pt => {
    draw_indices(pts, pt);
  })

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs

function gen_pt(arr, min_dist){
  //checks new point to see if it's greater than the min_dist
  let new_pt = {
    x:random(-canvas_x, canvas_x*2),
    y:random(-canvas_y, canvas_y*2),
    idxs:[]
  };
  
  arr.every(pt => {
    if(dist(pt.x, pt.y, new_pt.x, new_pt.y)<min_dist){
      new_pt = gen_pt(arr, min_dist);
      return false;
    }
    else{
      return true;
    }
  })

  return new_pt;
}

function furthest_pts(arr){
  //draw lines between the three furthest points
  arr.forEach((pt, current_idx) => {
    const distances=[];
    const idxs = [];
    //get distances between all points and pt
    arr.forEach((p, sub_idx) => {
      if(sub_idx == current_idx){
        distances.push(canvas_x*2)
      }
      else{
        distances.push(dist(p.x, p.y, pt.x, pt.y));
      }
    })

    //find three smallest distances between points
    const discard = floor(random(2,num_pts/2));
    for(let i=0; i<discard; i++){
      const index = indexOfMin(distances);
      distances[index] = canvas_x*2;
      if(i+2>=discard){
        idxs.push(index);
      }
    }
    pt.idxs = idxs;
  })
}

function draw_indices(pts, pt){
  //draw triangle between pt and two furthest points
  const c = color(random(working_palette));
  //assuming all palette colors use 255 for alpha, 
  //this check allows for color picker opacity settings
  if(c.levels[3] == 255) c.setAlpha(floor(random(100,220)));
  fill(c);
  drawingContext.filter= 'brightness(125%) blur(1px)'
  triangle(pts[pt.idxs[0]].x, pts[pt.idxs[0]].y, pts[pt.idxs[1]].x, pts[pt.idxs[1]].y, pt.x, pt.y);

  noFill();
  stroke("BLACK")
  strokeJoin(ROUND)
  strokeWeight(weight);
  drawingContext.filter = 'none'
  triangle(pts[pt.idxs[0]].x, pts[pt.idxs[0]].y, pts[pt.idxs[1]].x, pts[pt.idxs[1]].y, pt.x, pt.y);
}