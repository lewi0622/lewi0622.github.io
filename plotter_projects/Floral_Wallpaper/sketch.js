'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [COTTONCANDY, SIXTIES, SUPPERWARE]


function gui_values(){
  parameterize("dec", random(2,3),2,10,0.1,true);
  parameterize("points", floor(random(10,30)), 3, 100, 1, false);
  parameterize("scale_factor", random(10,15), 1, 30, 0.25, false);
  parameterize("noise_off", 50, 0, 100, 0.1, false);
  parameterize("starter_radius", canvas_x/global_scale/random(4.5,6), canvas_x/global_scale/10, canvas_x/global_scale/3, 1 ,true);
  parameterize("min_radius", 1, 0.1,50,0.1,true);
  parameterize("start_ang",0,0,360,1,false);
  parameterize("end_ang", 0, 0, 360, 1, false);
  parameterize("ang_div", 20, 1, 50, 0.5, false);
  parameterize("spacing", 60, 60, 400, true);
  parameterize("rows", 1, 1, 5, 1, false);
  parameterize("cols", 1, 1, 5, 1, false);
}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  
  // strokeWeight(random(0.25,0.75)*global_scale);
  // strokeWeight(COPICMARKER*3/4)
  let padding = starter_radius;
  translate(padding, padding);
  for(let j=0; j<rows; j++){
    for(let z=0; z<cols; z++){

      let radius = starter_radius;
      push();
      stroke((j+z+1)*10);
      translate(z*spacing,j*spacing);
      // if(j%2==1)translate(canvas_x/4,0);
      rotate(random(360));

      let noise_base = 0;
      let noise_inc = random(0.1,0.15);
      let dir = random([-1,1]);
      while(radius>min_radius){
        let noise_scale = radius/starter_radius*global_scale*scale_factor;
        let ang_scale;
        let pts = [];
        for(let i=0; i<points; i++){
          const ang = dir*i*(360/points);
          if(abs(ang)>start_ang && abs(ang)<=end_ang) ang_scale = noise_scale/ang_div;
          else ang_scale = noise_scale;
          const x = radius*cos(ang) + map(noise(i+noise_base), 0,1, -ang_scale, ang_scale);
          const y = radius*sin(ang) + map(noise(i+noise_base+noise_off), 0,1, -ang_scale, ang_scale);
          pts.push({x:x, y:y});
        }
        //by rotating randomly, the starts and ends of paths are randomized. so on the plot the overlaps don't line up
        pts = arrayRotate(pts, floor(random(pts.length)));
        beginShape();
        //set points+3 to close loops, or +4 to overlap loops and not have closed shapes
        for(let i=0; i<points+3; i++){
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

  global_draw_end();
}
//***************************************************
//custom funcs

