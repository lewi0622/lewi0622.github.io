'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [COTTONCANDY, SIXTIES, SUPPERWARE];

function gui_values(){
  parameterize("points", floor(random(10,30)), 3, 100, 1, false);
  parameterize("scale_factor", random(10,15), 1, 30, 0.25, false);
  parameterize("noise_off", 50, 0, 100, 0.1, false);
  parameterize("starter_radius", smaller_base/random(4.5,8), smaller_base/10, smaller_base/3, 1 ,true);
  parameterize("dec", smaller_base/random(130,200),0.1,smaller_base/2,0.1,true);
  parameterize("start_ang",0,0,360,1,false);
  parameterize("end_ang", 0, 0, 360, 1, false);
  parameterize("ang_div", 20, 1, 50, 0.5, false);
  parameterize("rows", floor(random([3, random(3,10)])), 1, 50, 1, false);
  parameterize("cols", floor(random([3, random(3,10)])), 1, 50, 1, false);
  parameterize("offset_rows", 1, 0, 1, 1, false);
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
  center_rotate(random([0,90,180,270]));
  png_bg(false);
  if(type == ("png")){
    strokeWeight(random(0.5,1)*global_scale);
    let stroke_c = random(working_palette);
    stroke(stroke_c);
    reduce_array(working_palette, stroke_c);
    fill(random(working_palette));
  }
  const row_spacing = canvas_y/(rows-1);
  const col_spacing = canvas_x/(cols-1);
  let svg_color_counter = 0;
  for(let j=0; j<rows; j++){
    for(let z=0; z<cols; z++){

      let radius = starter_radius;
      push();
      if(type == "svg") stroke(svg_color_counter);
      svg_color_counter++;
      translate(z*col_spacing,j*row_spacing);
      if(j%2==1 && offset_rows)translate(col_spacing/2,0);
      rotate(random(360));

      let noise_base = 0;
      let noise_inc = random(0.1,0.15);
      let dir = random([-1,1]);
      while(radius>0){
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

