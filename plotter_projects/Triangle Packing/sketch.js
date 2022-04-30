type = 'svg';

gif = false;
fr = 30;

noise_off = 20;
inc = 0.3*60/fr;

//***************************************************
function setup() {
  common_setup(gif, SVG);

  noFill();
  strokeWeight(1*global_scale);

  no_go = [] //triangle center x,y, radius for no-go areas
}
//***************************************************
function draw() {
  //bleed
  bleed_border = apply_bleed();
  translate(canvas_x/2, canvas_y/2);

  min_dist = 10*global_scale; //min dist beteween pts
  max_dist = 100*global_scale; //max dist between pts

  //actual drawing stuff
  too_cute = true;
  while(too_cute){
    pts = [] //traingle points 
    // generate first point
    pts.push({
      x:floor(random(min_dist, max_dist)),
      y:floor(random(min_dist, max_dist))
    })
    //generate next two points
    pts = gen_goldilocks(pts);
    pts = gen_goldilocks(pts);

    ang = find_smallest_angle(pts);
    too_cute = ang<30;
  }
  //first triangle
  triangle_arr(pts);
  no_go.push(calc_no_go(pts));
  push();
  translate(no_go[0].x, no_go[0].y);
  circle(0,0,no_go[0].r);
  pop();
  for(let i=0; i<3; i++){
    //pick triangle side
    // new_arr = pts.slice(i,2);

    // circle(new_pt.x, new_pt.y, 20);
  }
}
//***************************************************
//custom funcs
function triangle_arr(arr){
  triangle(arr[0].x, arr[0].y, arr[1].x, arr[1].y, arr[2].x, arr[2].y)
}

function gen_pt(){
  pt_ok = false;
  while(!pt_ok){
    new_pt = {
      x:floor(random(-canvas_x/2, canvas_x/2)),
      y:floor(random(-canvas_y/2, canvas_y/2))
    };   
    if(no_go.length == 0){
      return new_pt;
    }
    else{
      no_go.every(ctr => {
        pt_ok = dist(ctr.x, ctr.y, new_pt.x, new_pt.y)>ctr.r

        return pt_ok;
      });
    }
  }
  return new_pt;
}

function gen_goldilocks(arr){
  goldilocks = false;
  while(!goldilocks){
    new_pt = gen_pt();
    arr.every(pt => {
      if(dist(pt.x,pt.y,new_pt.x,new_pt.y)>min_dist && dist(pt.x,pt.y,new_pt.x,new_pt.y)<max_dist){
        goldilocks = true;
        return true;
      }

      goldilocks = false;
      return false;
    });
    if(goldilocks){
      pts.push(new_pt);
    }
  }
  return arr;
}

function find_smallest_angle(arr){
  sideA = dist(arr[0].x, arr[0].y, arr[1].x, arr[1].y);
  sideB = dist(arr[1].x, arr[1].y, arr[2].x, arr[2].y);
  sideC = dist(arr[2].x, arr[2].y, arr[0].x, arr[0].y);
  angleA = atan(sideA/sideB);
  angleB = atan(sideB/sideC);
  angleC = atan(sideC/sideA);
  return Math.min(angleA, angleB, angleC);
}

function calc_no_go(arr){
  //for a given triangle, calculate the center, and smallest circle that encompasses all pts
  centroid = {
    x: (arr[0].x+arr[1].x+arr[2].x)/3,
    y: (arr[0].y+arr[1].y+arr[2].y)/3
  }
  r = 0;
  arr.forEach(pt => {
    c_to_vert = dist(pt.x, pt.y, centroid.x, centroid.y);
    if(c_to_vert>r){
      r = c_to_vert;
    }
  });

  return{
    x: centroid.x,
    y: centroid.y,
    r: r*2
  };
}