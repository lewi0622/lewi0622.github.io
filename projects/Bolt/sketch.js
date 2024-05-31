'use strict'
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [GAMEDAY, BIRDSOFPARADISE, NURSERY];


function gui_values(){
  parameterize("num_pts", 5, 1, 20, 1, false);
  parameterize("num_circles", random(15,250), 1, 2000, 1, false);
  parameterize("radius", smaller_base/random(5,10), 0, smaller_base/2, 1, true);
  parameterize("num_colors", round(random(3, working_palette.length)), 3, working_palette.length, 1, false);
}

function setup() {
  common_setup();
  pixelDensity(1);
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();
  push();
  let style = "fill";
  noStroke();
  if(random()>0.5){
    style = "stroke"
    stroke("black");
    noFill();
  }

  colorMode(RGB);
  strokeWeight(2*global_scale);
  png_bg(true);
  colorMode(HSB);
  refresh_working_palette();
  const colors = [];
  const s = random(40, 100);
  for(let i=0; i<num_colors; i++){
    let c = random(working_palette);
    reduce_array(working_palette, c);
    c = RGBA_to_HSBA(...c);
    c[2] = 100;
    c[1] = s;
    colors.push(color(c));
  }
  let start_pt, end_pt;
  let start_quadrant, end_quadrant;
  let counter = 0;
  for(let j=0; j<num_pts; j++){
    start_quadrant = end_quadrant;
    if(j==0) start_quadrant = ceil(random(4));
    end_quadrant = start_quadrant;
    while(end_quadrant == start_quadrant){
      end_quadrant = ceil(random(4));
    }
    start_pt = end_pt;
    if(j==0) start_pt = quadrant_to_pt(start_quadrant, 0);
    end_pt = quadrant_to_pt(end_quadrant, 0);
    for(let i=0; i<num_circles; i++){
      push();
      translate(lerp(start_pt.x,end_pt.x,i/num_circles), lerp(start_pt.y, end_pt.y, i/num_circles));
      if(num_circles>100) blendMode([MULTIPLY, BLEND][i%2]);
      rotate(counter/2);
      counter++;
      set_linear_gradient(colors, 0, -radius/2, 0, radius/2, style);
      circle(0,0,radius);
      pop();
    }
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
function quadrant_to_pt(quadrant_number, margin){
  if(quadrant_number == 1){
    return {x:random(canvas_x/2, canvas_x-margin), y:random(margin, canvas_y/2)};
  };
  if(quadrant_number == 2){
    return {x:random(margin, canvas_x/2), y:random(margin, canvas_y/2)};
  };
  if(quadrant_number == 3){
    return {x:random(margin, canvas_x/2), y:random(canvas_y/2, canvas_y-margin)};
  };
  return {x:random(canvas_x/2, canvas_x-margin), y:random(canvas_y/2, canvas_y-margin)};
}