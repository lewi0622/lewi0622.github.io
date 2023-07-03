'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
suggested_palettes = [SOUTHWEST, SIXTIES]


function gui_values(){
  parameterize("bg_alpha", 150, 0,255,1,false);
  parameterize("x_offset", random(1,70), 1,70,1, true);
  parameterize("weight", 1, 0.1, 10, 0.1, true);
  parameterize("rad", random(100,200), 10, 400, 1, true);
  parameterize("bright", floor(random(150,600)), 0, 600, 1, false);
  parameterize("cloud_rad", 200, 1, 400, 1, true);
}

function setup() {
  common_setup();
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();

  //apply background

  //start with background color R, G, or B
  background(random(['RED', 'GREEN', 'BLUE']));
  let bg_c = random(working_palette);
  if(working_palette.length>3) reduce_array(working_palette, bg_c);
  bg_c = color(bg_c);
  bg_c.setAlpha(bg_alpha);
  fill(bg_c);
  noStroke();
  rect(0,0, canvas_x, canvas_y);

  //actual drawing stuff
  push();

  //cloudy background
  push();
  const sym_angs = round(random(4,20));
  center_rotate(360/sym_angs*ceil(random(sym_angs)));

  let cloud_c = [];
  working_palette = shuffle(working_palette, true);
  for(let i=0; i<3; i++){
    const col = color(random(working_palette));
    col.setAlpha(floor(random(3,10)));
    cloud_c.push(col);
  }

  noStroke();

  for(let i=0; i<1000; i++){
    push();
    const x =random();
    const y =random();

    const lim = 0.1;
    const lower_lim = 1/3 + map(noise(y), 0,1, 0, lim);
    const upper_lim = 2/3 + map(noise(y+100), 0,1, -lim, 0);

    if(x<lower_lim) fill(cloud_c[0]);
    else if(x>=lower_lim && x<upper_lim) fill(cloud_c[1]);
    else fill(cloud_c[2]);

    translate(map(x, 0,1, -canvas_x/2, canvas_x*1.5), map(y, 0,1, -canvas_y/2, canvas_y*1.5));
    circle(0,0, cloud_rad);
    pop();
  }
  filter(BLUR, 1*global_scale);

  pop();

  //neon stuff
  let c=color(random(working_palette));
  translate(canvas_x/2, canvas_y/2);
  drawingContext.filter = 'brightness('+bright+'%)';
  strokeWeight(weight);
  drawingContext.shadowBlur=5*global_scale;
  drawingContext.shadowColor = c;
  stroke(c);
  noFill();

  rotate(360/sym_angs*ceil(random(sym_angs)));
  let offset_me, offset;
  if(sym_angs%2==0){
    offset_me = true;
    offset = random(canvas_x/8);
  }
  else{
    offset_me = false;
  }

  // const x_offset = random(canvas_x/16, canvas_x/8);
  const shape = random(["CIR", "SQ"]);
  let cornering;
  let shape_rad = rad;
  if(random()>0.5) cornering = random(shape_rad/8)*global_scale;
  if(shape == "SQ") shape_rad = random(shape_rad/2, shape_rad);

  //running this multiple times gives brighter 'glow'
  const steps = round(map(sym_angs, 4,20, 5,2));

  for(let j=0; j<steps; j++){
    for(let i=0; i<sym_angs; i++){
      rotate(360/sym_angs);
      if(i%2==0 && offset_me){
        if(shape=="CIR") circle(x_offset+offset, 0, shape_rad);
        else if(shape=="SQ") square(x_offset+offset-shape_rad/2, -shape_rad/2, shape_rad, cornering);
      }
      else{
        if(shape=="CIR") circle(x_offset, 0, shape_rad);
        else if(shape=="SQ") square(x_offset-shape_rad/2, -shape_rad/2, shape_rad, cornering);
      }
    }
    if(shape=="CIR"){
      if(offset_me) circle(0,0, shape_rad+(x_offset+offset)*2);
      else circle(0,0, shape_rad+x_offset*2);
    }
  }

  
  filter(OPAQUE);

  pop();
  
  global_draw_end();
}
//***************************************************
//custom funcs