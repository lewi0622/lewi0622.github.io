'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 0.5;
const capture = false;
const capture_time = 10;

const suggested_palettes = [BIRDSOFPARADISE, SUMMERTIME, SOUTHWEST, SIXTIES];

function gui_values(){
  parameterize("num_rings", round(random(40,150)), 1, 200, 1, false);
  parameterize("ring_steps", round(random(3,100)), 3, 300, 1, false);
  parameterize("max_radius", canvas_x/global_scale/2.5, 1, canvas_x/global_scale, 10, true);
  parameterize("max_noise", random(1,7), 1, 50, 0.1, false);
  parameterize("num_blobs", round(random(20,30)), 1, 200, 1, false);
}

function setup() {
  common_setup();
  gui_values(); //540,960 x2 for reel
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();

  //apply background
  let bg_c = random(working_palette);
  if(type == "png") background(bg_c);

  //actual drawing stuff
  push();
  strokeWeight(0.05*global_scale);
  if(random()>0.5) noStroke();

  working_palette = controlled_shuffle(working_palette,true);

  for(let z=0; z<num_blobs; z++){
    push();

    const c = color(working_palette[z%working_palette.length]);
    fill(c);
    translate(random(canvas_x), random(canvas_y));
    rotate(random(360));
    let radius = map(noise(z/10), 0,1, canvas_x/8,max_radius);
    for(let i=0; i<num_rings; i++){
      push();
      if(i%2==0) blendMode(MULTIPLY);
      radius = lerp(radius,0,i/num_rings);

      beginShape();
      for(let j=0; j<ring_steps; j++){
        const theta = j/ring_steps*360;
        const xoff = map(cos(theta),-1,1,0,max_noise);
        const yoff = map(sin(theta),-1,1,0,max_noise);
        const r = map(noise(xoff,yoff, (z+10)*i/10),0,1,radius/2,radius);
        const x = r * sin(theta);
        const y = r * cos(theta);
        vertex(x,y);
      }
      endShape(CLOSE);
      pop();
    }
    pop();
  }
  
  
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs




