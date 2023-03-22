'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
suggested_palettes = [GAMEDAY,SOUTHWEST, SIXTIES];

function gui_values(){
  parameterize("damp", random(random(40)), 1, 1000, 0.1, false);
  // parameterize("line_steps", random(10,1000), 1, 5000, 10, false);
  // parameterize("number_points", random(1,20), 1, 100,1, false);
  parameterize("number_scribbles", floor(random(2,5)), 1, 20, 1, false);
  // parameterize("stroke_alpha", 1, 0, 255, 1, false);
  // parameterize("starting_radius", random(10,100), 1, 1000, 1, true);
  parameterize("shadow_blur_size", random(3), 0, 100, 1, true);
  parameterize("max_hypotenuse", 0, 0, 500, 1, true);
  parameterize("stroke_weight", random(0.1), 0, 1, 0.01,true);
}

function setup() {
  common_setup(gif);
}
//***************************************************
function draw() {
  capture_start(capture);
  //bleed
  const bleed_border = apply_bleed();

  refresh_working_palette();

  //actual drawing stuff
  push();
  rectMode(CENTER);
  noStroke();
  const bg_c = color(random(working_palette));
  background(bg_c);
  drawingContext.shadowBlur = shadow_blur_size;
  center_rotate(random(360));
  let shapes = "circle";
  if(random()>0.5) shapes = "square";
  for(let z=0; z<number_scribbles; z++){
    push();
    let c = random(working_palette);
    c = color(c);
    c.setAlpha(random(0, map(z, 0,number_scribbles, 25, 150)));
    fill(c);
    stroke(random(working_palette));
    strokeWeight(stroke_weight);
    drawingContext.shadowColor = c;

    let starting_radius;
    if(z!=0) starting_radius = random(10,20)*global_scale;
    else starting_radius = random(500,1000)*global_scale;
    //clear radius sin val
    let radius_theta = 0;

    //initial point
    let startX = random(0, canvas_x);
    let startY = random(0, canvas_y);
    let start = createVector(startX,startY);

    let number_points = random(1,random(1,10));
    for(let j=0; j<number_points; j++){
      //get destination point
      let endX = random(0, canvas_x);
      let endY = random(0, canvas_y);
      let end = createVector(endX, endY);

      const theta = atan((end.y-start.y)/(end.x-start.x));
      const impulse_angle = theta+random(-1,1)*90;

      let line_steps = random(10,1000);
      for(let i=0; i<line_steps; i++){
        center_rotate(random(0.05));
        radius_theta += 0.1;
        let radius = sin(radius_theta)*starting_radius;
        let vec = p5.Vector.lerp(start,end, i/line_steps);
        let impulse_size;
        if(i/line_steps<=0.5) impulse_size = lerp(0,max_hypotenuse,i/line_steps*2);
        else impulse_size = lerp(max_hypotenuse, 0,(i/line_steps*2)-1);
        const impulse = createVector(noise(i/damp)*sin(impulse_angle)*impulse_size, noise(i/damp)*cos(impulse_angle)*impulse_size);
        vec = p5.Vector.add(vec,impulse);
        if(shapes == "circle") circle(vec.x, vec.y, radius);
        else square(vec.x,vec.y,radius);
      }

      //loop cleanup
      start = end;
    }
    pop();
  }
  pop();
  //cutlines
  apply_cutlines(bleed_border);
  capture_frame(capture);
}
//***************************************************
//custom funcs




