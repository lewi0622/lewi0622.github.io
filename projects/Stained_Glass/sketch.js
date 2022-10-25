'use strict';
//setup variables
const gif = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
let suggested_palette;

//project variables
let working_palette, num_pts;

let gui_params = [];

function gui_values(){

}

function setup() {
  suggested_palette = random([SAGEANDCITRUS, COTTONCANDY, SUPPERWARE]);
  common_setup(gif);
}
//***************************************************
function draw() {
  capture_start(capture);

  clear();
  
  //bleed
  const bleed_border = apply_bleed();

  working_palette = JSON.parse(JSON.stringify(palette))

  noStroke();
  //apply background
  background(working_palette[floor(random(working_palette.length))]);

  //actual drawing stuff
  push();

  //create series of points
  const pt_size = floor(random(10,30)*global_scale);
  const pts = [];
  num_pts = floor(random(6,60));
  for(let i=0; i<num_pts; i++){
    const new_pt = gen_pt(pts, pt_size*2);
    pts.push(new_pt);
  }

  furthest_pts(pts);

  pts.forEach(pt => {
    draw_indices(pts, pt);
  })

  pop();
  //cutlines
  apply_cutlines(bleed_border);

  capture_frame(capture);
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
  c.setAlpha(floor(random(100,220)));
  fill(c);
  drawingContext.filter= 'brightness(125%) blur(1px)'
  triangle(pts[pt.idxs[0]].x, pts[pt.idxs[0]].y, pts[pt.idxs[1]].x, pts[pt.idxs[1]].y, pt.x, pt.y);

  noFill();
  stroke("BLACK")
  strokeJoin(ROUND)
  strokeWeight(8)
  drawingContext.filter = 'none'
  triangle(pts[pt.idxs[0]].x, pts[pt.idxs[0]].y, pts[pt.idxs[1]].x, pts[pt.idxs[1]].y, pt.x, pt.y);
}