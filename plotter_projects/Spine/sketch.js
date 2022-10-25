'use strict';
//setup variables
const gif = false;
const fr = 1;
const capture = false;
const capture_time = 8;


function gui_values(){

}

function setup() {
  common_setup(gif, SVG);
}
//***************************************************
function draw() {
  capture_start(capture);
  clear();

  noFill();
  strokeCap(SQUARE);
  const colors = gen_n_colors(2);
  strokeWeight(0.5*global_scale)

  let pts0 = [];
  let pts1 = [];
  let pts2 = [];
  //bleed
  const bleed_border = apply_bleed();

  //actual drawing stuff
  // center_rotate(90);
  push();
  const margin = canvas_x/64;
  for(let i=0; i<3; i++){
    const step_size = floor(random(15,30))*global_scale;
    console.log(step_size)
    const side_spacing = floor(random(4,10))*step_size;
    translate(0, canvas_y/4);
    if(i==1){
      const pt_spacing = 1*step_size;
      for(let j=0;j<canvas_x*1.2; j+=step_size){
        const y=(sin(j) + map(noise(i+j), 0,1, -1,1))*10*global_scale;
        if(j>margin && j<(canvas_x-margin) && j%pt_spacing==0){
          pts1.push({
            x:j, 
            y:y
          })
        }
      }
    }
    else{
      for(let j=0;j<canvas_x*1.2; j+=step_size){
        //create points
        if(j>canvas_x/8 && j<(canvas_x-margin) && j%side_spacing==0){
          if(i==0){
            pts0.push({
              x:j, 
              y:(map(noise(i+j), 0,1, -1,1))*10*global_scale
            })
          }
          else if(i==2){
            pts2.push({
              x:j, 
              y:(map(noise(i+j), 0,1, -1,1))*10*global_scale
            })
          }
        }
      }
    }
  }  
  pop();
  let min_dist, current_id;
  pts1.forEach(pt1 => {
    //find nearest pt on each curve
    stroke(colors[0]);
    min_dist = 10000000;
    current_id = -1;
    console.log(pts0);
    pts0.forEach((pt0, idx) =>{
      if(dist(pt1.x, pt1.y, pt0.x, pt0.y)<min_dist){
        min_dist = dist(pt1.x, pt1.y, pt0.x, pt0.y);
        current_id = idx
      }
    })
    console.log(pt1, pts0[current_id]);
    line(pt1.x, pt1.y+canvas_y/2, pts0[current_id].x, pts0[current_id].y+canvas_y/4);

    stroke(colors[1]);
    min_dist = 10000000;
    current_id = -1;
    pts2.forEach((pt2, idx) =>{
      if(dist(pt1.x, pt1.y, pt2.x, pt2.y)<min_dist){
        min_dist = dist(pt1.x, pt1.y, pt2.x, pt2.y);
        current_id = idx
      }
    })
    line(pt1.x, pt1.y+canvas_y/2, pts2[current_id].x, pts2[current_id].y+canvas_y*3/4);
  });

  stroke(random(colors));
  translate(0, canvas_y/2);
  beginShape();
  curveVertex(pts1[0].x, pts1[0].y);
  pts1.forEach(pt => {
    curveVertex(pt.x, pt.y);
  });
  curveVertex(pts1[pts1.length-1].x, pts1[pts1.length-1].y);
  endShape();

  //cleanup
  apply_cutlines(bleed_border);

  capture_frame(capture);
}
//***************************************************
//custom funcs


