'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = []

let hexagon_size, iteration;

function gui_values(){
  parameterize("num_hexagons", 10, 1, 100, 1, false);
  parameterize("starting_hex_size", base_x/2, 0, base_x*2, 1, true);
  parameterize("hatch_spacing", 1, 0.01, 5, 0.01, true);
  parameterize("hatch_variation", 0.5, 0, 5, 0.01, true);
}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();

  if(save_svg) endRecordSvg();
  push();
  strokeWeight(BICCRISTAL * global_scale);
  translate(width/2, height/2);

  //filename
  //save_svg

  for(let i=0; i<num_hexagons; i++){
    push();
    hexagon_size = lerp(starting_hex_size, 0, i/num_hexagons);
    iteration = i;
    if(type=="png"){
      noStroke();
      fill("WHITE");
      draw_hex();
    }
    pop();
    push();
    if(type == "png")clip(draw_hex);
    else if(save_svg){
      const new_filename = str(iteration) + filename;
      beginRecordSvg(new_filename);
    }
    const hatch_angle = map(noise(i/10), 0,1, 0,360);
    rotate(random([0,180]));
    stroke("RED")
    hatch(hexagon_size*2, hexagon_size*2, hatch_spacing, hatch_variation, -hexagon_size, -hexagon_size, hatch_angle);
    pop();
    
    noFill();
    stroke("BLACK")
    draw_hex();

    if(save_svg){
      endRecordSvg();
    }
  }

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs

function draw_hex(){
  polygon(0,0,hexagon_size,6);
}


function hatch(hatch_width, hatch_height, spacing = 2*global_scale, spacing_variation = 1*global_scale, start_x = 0, start_y = 0, angle = random(360), angle_variation = 3){
  //starts in upper left corner of a rectangle and hatches vertically
  push();  
  //move to start
  translate(start_x, start_y);
  
  //apply angle at center of hatch
  translate(hatch_width/2, hatch_height/2);
  rotate(angle);
  //calculate hypotenuse
  const hypotenuse = sqrt(hatch_width * hatch_width + hatch_height * hatch_height);
  //apply hypotenuse to offset
  translate(-hypotenuse/2, -hypotenuse/2);
  
  //number of steps
  const num_hatches = ceil(hypotenuse/spacing);
  
  for(let i=0; i<num_hatches; i++){
    push();
    //apply spacing
    translate(i * spacing, 0);

    //apply spacing variation
    translate(spacing_variation * random(-1,1), 0);
    
    //apply angle_variation randomly accross the height, if applied at the same y val, a pattern emerges
    const y_angle_value = random(hypotenuse);
    translate(0, y_angle_value);
    rotate(angle_variation * random(-1,1));
    translate(0, -y_angle_value);

    //hatch
    line(0,0, 0, hypotenuse);
    pop();
  }
  pop();
}