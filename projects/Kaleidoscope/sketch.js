gif = false;
fr = 1;

capture = false;
capture_time = 10
function setup() {
  common_setup(gif);
  change_default_palette(random([SAGEANDCITRUS, COTTONCANDY, SUPPERWARE]));
  message_details();

  bg_c = color(random(palette));

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

  //create series of points
  pt_size = floor(random(10,30))*global_scale;
  pts = [];
  num_pts = floor(random(4,80));
  for(let i=0; i<num_pts; i++){
    new_pt = gen_pt(pts, pt_size*2);
    pts.push(new_pt);
  }

  furthest_pts(pts);

  pts.forEach(pt => {
    draw_indices(pts, pt);
  })

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
    x:floor(random(-canvas_x, canvas_x*2)),
    y:floor(random(-canvas_y, canvas_y*2)),
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
    distances=[];
    idxs = [];
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
    discard = floor(random(2,num_pts/2));
    for(let i=0; i<discard; i++){
      index = indexOfMin(distances);
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
  c = random(palette)
  c[3] = floor(random(100,220));
  fill(c);
  triangle(pts[pt.idxs[0]].x, pts[pt.idxs[0]].y, pts[pt.idxs[1]].x, pts[pt.idxs[1]].y, pt.x, pt.y);
}