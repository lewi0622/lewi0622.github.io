'use strict';
//setup variables
const gif = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
let suggested_palette;


function gui_values(){

}

function setup() {
  suggested_palette = random([COTTONCANDY, SIXTIES, SUPPERWARE]);
  common_setup(gif, SVG);
}
//***************************************************
function draw() {
  capture_start(capture);
  //bleed
  const bleed_border = apply_bleed();

  //actual drawing stuff
  push();

  refresh_working_palette();

  let tree_c = random(working_palette);
  fill(tree_c);
  reduce_array(working_palette,tree_c);

  strokeWeight(random(0.25,0.75)*global_scale);
  stroke(random(working_palette));

  const min_radius = 1*global_scale;
  const noise_off = 50;

  const dec = random(2,3)*global_scale;
  const points = floor(random(10,30));
  const scale_factor = random(10,15); 
  const starter_radius = canvas_x/random(4.5,6);
  const rows = 3;
  const cols = 3;
  for(let j=0; j<rows; j++){
    for(let z=0; z<cols; z++){
      stroke(random(255));
      let radius = starter_radius;
      push();
      translate(z*canvas_x/2,j*canvas_y/2);
      if(j==1)translate(canvas_x/4,0);
      rotate(random(360));

      let noise_base = 0;
      let noise_inc = random(0.1,0.15);
      let dir = random([-1,1]);
      while(radius>min_radius){
        beginShape();
        let noise_scale = radius/starter_radius*global_scale*scale_factor;
        let pts = [];
        for(let i=0; i<points; i++){
          const ang = dir*i*(360/points);
          const x = radius*cos(ang) + map(noise(i+noise_base), 0,1, -noise_scale, noise_scale);
          const y = radius*sin(ang) + map(noise(i+noise_base+noise_off), 0,1, -noise_scale, noise_scale);
          pts.push({x:x, y:y});
        }
        //by rotating randomly, the starts and ends of paths are randomized. so on the plot the overlaps don't line up
        pts = arrayRotate(pts, floor(random(pts.length)));
        beginShape();
        for(let i=0; i<points+4; i++){
          print("i ",i, " elem ", i%pts.length);
          curveVertex(pts[i%pts.length].x, pts[i%pts.length].y)
        }
        endShape();
        noFill();
        radius += random(-dec);
        noise_base += noise_inc;
      }
      pop();
    }
  }
  pop();

  //cleanup
  apply_cutlines(bleed_border);

  capture_frame(capture);
}
//***************************************************
//custom funcs

