'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 2;
const capture = false;
const capture_time = 10;

const suggested_palettes = [SUMMERTIME];

function gui_values(){
  parameterize("num_loops", round((random(3,26) +1)/2)*2-1, 1, 100, 2, false);
  parameterize("num_lines", floor(random(5,16)), 1, 100, 1, false);
  parameterize("repeat_lines", 3, 1, 10, 1, false);
  parameterize("min_radius", smaller_base/32, 0, smaller_base/2, 1, true);
  parameterize("max_radius", smaller_base/16, 0, smaller_base/2, 1, true);
  parameterize("margin_x", base_x/8, -base_x/2, base_x/2, 1, true);
  parameterize("radius_mult", random(0.5,1.5), 0.1, 10, 0.1, false);
} 

function setup() {
  common_setup();
  // pixelDensity(15);
  gui_values();

  strokeJoin(ROUND);
}
//***************************************************
function draw() {
  global_draw_start();
  push();
  background("BLACK");
  stroke("WHITE");
  strokeWeight(5*global_scale);
  noFill();
  center_rotate(90);

  const pts = [];

  let x = 0;
  let y = 0;
  for(let i=0; i<num_loops; i++){
    const radius = random(min_radius, max_radius);
    let direction = 1;
    if (i % 2 == 1) direction = -1;
    if (direction == 1) x = random(max(x,radius*2), canvas_x-margin_x*2);
    else x = random(radius*2, x);
    pts.push({
      x: x,
      y: y,
      radius: radius
    });
    y += 2*radius;
  }
  
  translate(margin_x, (canvas_y-y)/2);
  const modes = controlled_shuffle([MULTIPLY, ADD, BLEND], false);

  const theta_offset = -90;
  for(let j=0; j<num_lines; j++){
    blendMode(modes[j%modes.length]);
    strokeWeight(lerp(20,0.5,j/num_lines)*global_scale);
    const c = random(working_palette);
    stroke(c);
    if(j==0) fill(c);
    else noFill();
    line_blur(c, lerp(4,0,j/num_lines)*global_scale);
    for(let k=0; k<repeat_lines; k++){
      beginShape();
      vertex(0,0);
      for(let i=0; i<pts.length; i++){
        let direction = 1;
        if(i%2 == 1) direction = -1;
        const x = pts[i].x;
        const y = pts[i].y + pts[i].radius;
        let actual_radius = lerp(pts[i].radius*radius_mult, 0, j/num_lines);
        for (let k = 0; k < 180; k++){
          //half circle
          const theta = k * direction + theta_offset;
          vertex(x + actual_radius * cos(theta), y + actual_radius * sin(theta));
        }
      }
      vertex(0,pts[pts.length-1].y + pts[pts.length-1].radius*2);
      endShape(CLOSE);
    }
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
