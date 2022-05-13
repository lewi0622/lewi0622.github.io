gif = false;
fr = 30;

capture = false;
capture_time = 5;
function setup() {
  suggested_palette = random([BEACHDAY, COTTONCANDY, NURSERY]);
  common_setup(gif);

  //create series of points
  pt_size = 20*global_scale;
  pts = [];
  for(let i=0; i<floor(random(10,30)); i++){
    new_pt = gen_pt(pts, pt_size*2);
    pts.push(new_pt);
  }

  //color index
  c_idx = 0;
  working_palette = JSON.parse(JSON.stringify(palette))
  bg_c = color(random(working_palette));
  lerp_step = 0.2;
  frame_switch = fr;

  furthest_pts(pts);
  noStroke();
}
//***************************************************
function draw() {
  capture_start(capture);

  clear();
  //bleed
  bleed_border = apply_bleed();

  //apply background
  background(bg_c);

  //actual drawing stuff
  push();

  //move pts
  get_new_pts = frameCount%frame_switch == 0;

  pts.forEach(pt => {
    if(!pt.moving || get_new_pts){
      new_pt = gen_pt([pt], pt_size*8);
      pt.dest_x = new_pt.x;
      pt.dest_y = new_pt.y;
      pt.moving = true;
    }
    pt.x = lerp(pt.x, pt.dest_x, lerp_step);
    pt.y = lerp(pt.y, pt.dest_y, lerp_step);

    draw_indices(pts, pt);
  })

  //frame cleanup
  c_idx = 0;

  pop();
  //cutlines
  apply_cutlines();

  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs

function gen_pt(arr, min_dist){
  //checks new point to see if it's greater than the min_dist
  new_pt = {
    x:random(pt_size, canvas_x-pt_size),
    y:random(pt_size, canvas_y-pt_size),
    moving:false,
    dest_x:0,
    dest_y:0,
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
  arr.forEach(pt => {
    distances=[];
    idxs = [];
    //get distances between all points and pt
    arr.forEach(p => {
      distances.push(dist(p.x, p.y, pt.x, pt.y))
    })

    //find three largest distances between points
    for(let i=0; i<2; i++){
      index = indexOfMax(distances);
      idxs.push(index);
      distances[index] = 0;
    }
    pt.idxs = idxs;
  })
}

function draw_indices(pts, pt){
  //draw triangle between pt and two furthest points
  c = working_palette[c_idx%palette.length]
  c_idx++
  c[3] = 100;
  fill(c);
  triangle(pts[pt.idxs[0]].x, pts[pt.idxs[0]].y, pts[pt.idxs[1]].x, pts[pt.idxs[1]].y, pt.x, pt.y);
}