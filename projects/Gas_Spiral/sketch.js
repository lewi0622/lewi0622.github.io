gif = false;
fr = 1;

capture = false;
capture_time = 10;
function setup() {
  suggested_palette = random([COTTONCANDY, BIRDSOFPARADISE, SOUTHWEST]);
  common_setup(gif);
}
//***************************************************
function draw() {
  capture_start(capture);
  //bleed
  bleed_border = apply_bleed();

  working_palette = JSON.parse(JSON.stringify(palette));

  //apply background
  bg_c = random(working_palette)
  background(bg_c)
  reduce_array(working_palette, bg_c)

  //actual drawing stuff
  push();
  translate(canvas_x/2, canvas_y/2);
  dir = random([-1,1]);
  for(let i=0; i<50; i++){
    //confine start vector to circle
    theta = noise(i)*360;
    start_rad = random(20,50)*global_scale;
    start = createVector(start_rad*cos(theta), start_rad*sin(theta), 0);
    steps = random(75,150);
    scale_factor = 1.5*global_scale;
    slope = start.y/start.x;
    radius = random(1,10)*global_scale;

    //init 
    prev_x = start.x;
    prev_y = start.y;

    noStroke();
    //get two unique colors
    col1 = color(random(palette));
    col2 = color(random(palette));
    while(col2==col1){
      col2=random(palette);
    }

    for(let j=0; j<steps; j++){
      fill(lerpColor(col1, col2, j/steps));
      new_x = start.x + Math.sign(start.x)*j*scale_factor;
      new_y = new_x*slope;
      radius += random(-2, 2)*global_scale
      ellipse(new_x, new_y, random(radius*.75, radius*1.5), random(radius*.75, radius*1.5));
      rotate(random(0,4)*dir);
      prev_x = new_x;
      prev_y = new_y;
    }
  }
 
  pop();
  //cleanup
  apply_cutlines(bleed_border);

  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs
