'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

suggested_palettes = [BUMBLEBEE, SUMMERTIME, SOUTHWEST, SIXTIES, SUPPERWARE]

let c1, c2, c3, c4, c5;

function gui_values(){
  parameterize("num_circles", round(random(5,200)), 1, 500, 1, false);
  parameterize("starting_radius", min(canvas_x, canvas_y)*0.3, 1, 400, 1, true);
  parameterize("ending_radius", 0, 0, 500, 1, true);
  parameterize("drift_x_pct", random([-0.5, -0.25, 0, 0, 0.25, 0.5]), -1, 1, 0.01, false);
  parameterize("drift_y_pct", random([-0.5, -0.25, 0, 0, 0.25, 0.5]), -1, 1, 0.01, false);
  parameterize("cornering_end", random(-1, 0.5), -4, 4, 0.1, false);
  parameterize("cornering_start", constrain(random(), 0, 0.5), -4, 4, 0.1, false);
  parameterize("rotation_per_loop", random([0,random(-180,180)]), -180, 180, 0.1, false);
  parameterize("gradient_rotation_per_loop", random([-rotation_per_loop, rotation_per_loop, 0, random(-1,1)]), -180, 180, 0.1, false);
}

function setup() {
  common_setup();
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  working_palette = shuffle(working_palette, true);
  let bg_c = random(working_palette);
  background(bg_c);

  //stroke
  if(random()>0.75){
    if(random()>0.5) stroke("BLACK");
    else stroke(random(working_palette));
    strokeWeight(random(0.01,0.1)*global_scale);
  }
  else noStroke();

  c1 = color(working_palette[0]);
  c2 = color(working_palette[1]);
  c3 = color(working_palette[2]);
  if(random()>0.5 && working_palette.length >= 5){
    c4 = color(working_palette[3]);
    c5 = color(working_palette[4]);
  }

  //gradient background
  const gradient = drawingContext.createLinearGradient(0,0,canvas_x, canvas_y);
  add_color_stops_and_fill(gradient);
  center_rotate(random([0,180]));
  
  if(random()>0.5) square(0,0,max(canvas_x, canvas_y));
  rectMode(CENTER);
  translate(canvas_x/2, canvas_y/2);
  rotate(random([0,90,180,270]));

  for(let i=0; i<num_circles; i++){ 
    push();
    const radius = lerp(starting_radius, ending_radius, i/num_circles);
    const x = lerp(0,starting_radius,i/num_circles) * drift_x_pct;
    const y = lerp(0,starting_radius,i/num_circles) * drift_y_pct;

    translate(x,y);
    rotate(rotation_per_loop*i);

    let r = radius/2;
    const theta = gradient_rotation_per_loop * i;
    const grad_start_pt = {
      x: r*cos(theta),
      y: r*sin(theta)
    };

    r = -radius/2;
    const grad_end_pt = {
      x: r*cos(theta),
      y: r*sin(theta)
    };

    const gradient = drawingContext.createLinearGradient(grad_start_pt.x, grad_start_pt.y, grad_end_pt.x, grad_end_pt.y);
    add_color_stops_and_fill(gradient);

    let corner_radius = constrain(lerp(radius*cornering_start, radius*cornering_end, (i+1)/num_circles), 0, starting_radius);
    square(0, 0, radius, corner_radius, corner_radius, corner_radius, corner_radius);
    pop();
  }

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs
function add_color_stops_and_fill(gradient){
  gradient.addColorStop(0, c1);
  if(c4 !== undefined) gradient.addColorStop(0.25, c4);
  gradient.addColorStop(0.5,c2);
  if(c5 !== undefined) gradient.addColorStop(0.75, c5);
  gradient.addColorStop(1, c3);
  drawingContext.fillStyle = gradient;
}