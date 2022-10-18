'use strict';
//setup variables
const gif = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
let suggested_palette;

function setup() {
  suggested_palette = random([COTTONCANDY, SIXTIES, SUPPERWARE]);
  common_setup(gif);
}
//***************************************************
function draw() {
  capture_start(capture);
  //bleed
  const bleed_border = apply_bleed();

  //actual drawing stuff
  push();

  let working_palette = JSON.parse(JSON.stringify(palette));
  //apply background
  let bg_c = random(working_palette)
  background(bg_c)
  reduce_array(working_palette, bg_c)

  let tree_c = random(working_palette);
  fill(tree_c);
  reduce_array(working_palette,tree_c);

  strokeWeight(random(0.5,1)*global_scale);
  stroke(random(working_palette));

  const min_radius = 1*global_scale;
  const noise_off = 20;

  const dec = random(1,5)*global_scale;
  const points = floor(random(10,30));
  const scale_factor = random(200,400)/points; 
  const starter_radius = canvas_x/random(4.5,6);
  const rows = 3;
  const cols = 3;
  for(let j=0; j<rows; j++){
    for(let z=0; z<cols; z++){
      let radius = starter_radius;
      push();
      translate(z*canvas_x/2,j*canvas_y/2);
      if(j==1)translate(canvas_x/4,0);
      rotate(random(360));

      let noise_base = 0;
      const noise_inc = random(0.05,0.1);
      while(radius>min_radius){
        let x0,y0,x1,y1;
        beginShape();
        for(let i=0; i<points; i++){
          let noise_scale = radius/starter_radius*global_scale*scale_factor;
          const x = radius*cos(i*(360/points)) + map(noise(i+noise_base), 0,1, -noise_scale, noise_scale);
          const y = radius*sin(i*(360/points)) + map(noise(i+noise_base+noise_off), 0,1, -noise_scale, noise_scale);
          if(i==0){
            //use last point as control pts
            curveVertex(radius*cos((points-1)*(360/points)) + map(noise((points-1)), 0,1, -noise_scale, noise_scale),radius*sin((points-1)*(360/points)) + map(noise((points-1)+noise_off), 0,1, -noise_scale, noise_scale));
            x0=x;
            y0=y;
          }
          else if(i==1){
            x1=x;
            y1=y;
          }

          curveVertex(x,y);
        }
        curveVertex(x0,y0);
        curveVertex(x1,y1);
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

