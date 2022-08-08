'use strict';
//setup variables
const gif = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
let suggested_palette;

function setup() {
  suggested_palette = random([COTTONCANDY, GAMEDAY, SUPPERWARE]);
  common_setup(gif);
}
//***************************************************
function draw() {
  capture_start(capture);

  clear();
  
  //bleed
  const bleed_border = apply_bleed();

  let working_palette = JSON.parse(JSON.stringify(palette))
  let bg_c = random(working_palette);
  reduce_array(working_palette, bg_c)

  noStroke();

  //apply background
  background(bg_c)

  //actual drawing stuff
  push();
  let start_size = 600*global_scale;
  const sym_angs = 8;
  for(let j=0; j<sym_angs; j++){
    center_rotate(360/sym_angs);
    push();
    let c1 = color(random(working_palette));
    let c2 = c1;
    while(c2==c1){
      c2=color(random(working_palette));
    }
    
    c1.setAlpha(random(100,200));
    c2.setAlpha(random(100,200));

    const tri_size = random(start_size/8, start_size);
    start_size = tri_size;
    const steps = 40;
    const pt1={x:0,y:0}
    const pt2={x:tri_size,y:0}
    const pt3={x:0,y:tri_size}
    const dir = random([-1, 1]);
    const x_dest = random(canvas_x*.9, canvas_x);
    const y_dest = random(canvas_y*.9, canvas_y);
    for(let i=0; i<steps; i++){
      c1 = lerpColor(c1, c2, 0.05)
      fill(c1);
      triangle(pt1.x, pt1.y, pt2.x, pt2.y, pt3.x, pt3.y)
      const diffx = lerp(pt1.x, x_dest, 0.1) - pt1.x;
      const diffy = lerp(pt1.y, y_dest, 0.1) - pt1.y;
      
      pt1.x += diffx;
      pt1.y += diffy;
  
      pt2.x +=diffx;
      pt2.y +=diffy;

      pt3.x +=diffx;
      pt3.y +=diffy;

      center_rotate(random(4,5)*dir);
    }
    pop();
  }

  pop();
  //cutlines
  apply_cutlines(bleed_border);

  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs
