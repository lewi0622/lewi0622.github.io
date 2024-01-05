'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [COTTONCANDY, SIXTIES, SUPPERWARE]


function gui_values(){

}

function setup() {
  common_setup();
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();

  refresh_working_palette();
  
  let tree_c = random(working_palette);
  fill(tree_c);
  reduce_array(working_palette,tree_c);
  
  //apply background
  let bg_c = random(working_palette)
  background(bg_c)

  strokeWeight(random(0.25,0.75)*global_scale);
  stroke(random(working_palette));

  const min_radius = 1*global_scale;
  const noise_off = 50;

  const dec = random(1,3)*global_scale;
  const points = floor(random(10,30));
  const scale_factor = random(10,15); 
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
      let noise_inc = random(0.1,0.15);
      let dir = random([-1,1]);
      while(radius>min_radius){
        let x0,y0,x1,y1;
        beginShape();
        let noise_scale = radius/starter_radius*global_scale*scale_factor;

        for(let i=0; i<points; i++){
          const ang = dir*i*(360/points);
          const x = radius*cos(ang) + map(noise(i+noise_base), 0,1, -noise_scale, noise_scale);
          const y = radius*sin(ang) + map(noise(i+noise_base+noise_off), 0,1, -noise_scale, noise_scale);
          if(i==0){
            //use last point as control pts
            curveVertex(radius*cos(dir*(points-1)*(360/points)) + map(noise((points-1)), 0,1, -noise_scale, noise_scale),radius*sin(dir*(points-1)*(360/points)) + map(noise((points-1)+noise_off), 0,1, -noise_scale, noise_scale));
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

  global_draw_end();
}
//***************************************************
//custom funcs

