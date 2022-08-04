gif = false;
sixteen_by_nine = false;
fr = 1;

capture = false;
capture_time = 10;
function setup() {
  suggested_palette = random([BEACHDAY, GAMEDAY, NURSERY]);
  common_setup(gif);
}
//***************************************************
function draw() {
  capture_start(capture);
  //bleed
  bleed_border = apply_bleed();

  working_palette = JSON.parse(JSON.stringify(palette));
  strokeCap(random([PROJECT,ROUND]))

  //apply background
  bg_c = random(working_palette)
  background(bg_c)
  reduce_array(working_palette, bg_c)

  //actual drawing stuff

  //background stuff
  center_rotate(random(360));
  push();


  translate(canvas_x/2, canvas_y/2);
  noStroke();
  c1 = random(working_palette);
  reduce_array(working_palette, c1);

  c2 = random(working_palette);
  opacity = 2;
  c1[3] = opacity;
  c2[3] = opacity;
  ang = 360/floor(random(4,19));
  steps = 5000;
  for(let i=0; i<steps; i++){
    rotate(ang);
    c = lerpColor(color(c1), color(c2), i/steps);
    fill(c);
    c = lerpColor(color(c2), color(c1), i/steps);
    stroke(c);
    x =random(500)*global_scale;
    size = random(200)*global_scale;
    square(x, 0, size);
  }

  filter("blur", 5*global_scale);
  pop();

  // Spiral shapes
  push();
  noStroke();
  working_palette = JSON.parse(JSON.stringify(palette));
  steps = 1000;    
  c1 = random(working_palette);
  reduce_array(working_palette,c1);
  c2 = random(working_palette);
  opacity = 200;
  c1[3] = opacity;
  c2[3] = opacity;
  drawingContext.shadowColor = color(0,0,0,100);
  translate(canvas_x/2, canvas_y/2);
  phi = random(1,255);
  dist_scale = random(1.25,2.5);
  //50/50 circle or square.
  circ = random()>0.5;
  dir = random([1,-1]);
  for(let i=0; i<steps; i++){
    f = i/steps;
    c = lerpColor(color(c1), color(c2), f*2);
    fill(c);
    radius = sqrt(0.5);
    angle = i * phi * dir;
    smaller_cnv = canvas_x;
    if(canvas_y<canvas_x){
      smaller_cnv = canvas_y;
    }
    dist = f * radius * smaller_cnv*dist_scale;
    x = cos(angle)*dist;
    y = sin(angle)*dist;

    size = map(f, 0,1,0,100)*global_scale;
    drawingContext.shadowBlur = size/floor(random(2,6));
    if(circ){
      circle(x,y, size);
    }
    else{
      square(x-size/2,y-size/2,size);
    }
  }
  pop();

  //cutlines
  apply_cutlines();
  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs




