'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

suggested_palettes = [GAMEDAY,SOUTHWEST, SIXTIES];

function gui_values(){
  parameterize("number_scribbles", floor(random(2,4)), 1, 20, 1, false);
  parameterize("shadow_blur_size", random(3), 0, 100, 1, true);
  parameterize("stroke_weight", random(0.25), 0, 1, 0.01,true);
}

function setup() {
  common_setup();
}
//***************************************************
function draw() {
  global_draw_start();

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
    let fill_c = random(working_palette);
    let stroke_c = fill_c;
    while(arrayEquals(fill_c,stroke_c)){
      stroke_c = random(working_palette);
    }
    stroke(stroke_c);
    strokeWeight(stroke_weight);

    fill_c = color(fill_c);
    fill_c.setAlpha(random(0, map(z, 0,number_scribbles, 25, 150)));
    fill(fill_c);
    drawingContext.shadowColor = stroke_c;

    let starting_radius;
    if(z!=0) starting_radius = random(10,20)*global_scale;
    else starting_radius = random(500,1000)*global_scale;
    //clear radius sin val
    let radius_theta = 0;

    //initial point
    let startX = random(0, canvas_x);
    let startY = random(0, canvas_y);
    let start = createVector(startX,startY);

    const number_points = random(1,random(1,10));

    for(let j=0; j<number_points; j++){
      const rotation_inc = random(0.005,0.1);
      //get destination point
      let endX = random(0, canvas_x);
      let endY = random(0, canvas_y);
      let end = createVector(endX, endY);

      let line_steps = random(10,500);
      for(let i=0; i<line_steps; i++){
        center_rotate(rotation_inc);
        radius_theta += 0.1;
        let radius = sin(radius_theta)*starting_radius;
        let vec = p5.Vector.lerp(start,end, i/line_steps);

        if(shapes == "circle") circle(vec.x, vec.y, radius);
        else square(vec.x,vec.y,radius);
      }

      //loop cleanup
      start = end;
    }
    pop();
  }
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs




