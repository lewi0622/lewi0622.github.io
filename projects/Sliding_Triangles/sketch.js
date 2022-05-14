gif = false;
fr = 1;

capture = false;
capture_time = 10;
function setup() {
  suggested_palette = random([BEACHDAY, SOUTHWEST, SUPPERWARE]);
  common_setup(gif);

  working_palette = JSON.parse(JSON.stringify(palette))
  bg_c = random(working_palette);
  reduce_array(working_palette, bg_c)

  noStroke();
}
//***************************************************
function draw() {
  capture_start(capture);

  clear();
  
  //bleed
  bleed_border = apply_bleed();

  //apply background
  background(bg_c)


  //actual drawing stuff
  push();
  start_size = 600;
  sym_angs = 8;
  for(let j=0; j<sym_angs; j++){
    center_rotate(360/sym_angs);
    push();
    c1 = random(working_palette);
    c2 = c1;
    while(c2==c1){
      c2=random(working_palette);
    }
    
    c1[3]=random(100,200);
    c2[3]=random(100,200);
    c1 = color(c1);
    c2 = color(c2);

    size = random(start_size/8, start_size)*global_scale;
    start_size = size;
    steps = 40;
    pt1={x:0,y:0}
    pt2={x:size,y:0}
    pt3={x:0,y:size}
    for(let i=0; i<steps; i++){
      c1 = lerpColor(c1, c2, 0.05)
      fill(c1);
      triangle(pt1.x, pt1.y, pt2.x, pt2.y, pt3.x, pt3.y)
      diffx = lerp(pt1.x, canvas_x, 0.1) - pt1.x;
      diffy = lerp(pt1.y, canvas_y, 0.1) - pt1.y;
      
      pt1.x += diffx;
      pt1.y += diffy;
  
      pt2.x +=diffx;
      pt2.y +=diffy;

      pt3.x +=diffx;
      pt3.y +=diffy;

      // pt2.x += random(diffx/2, diffx*2);
      // pt2.y += random(diffy/2, diffy*2);
  
      // pt3.x += random(diffx/2, diffx*2);
      // pt3.y += random(diffy/2, diffy*2);
      center_rotate(5);
    }
    pop();
  }

  pop();
  //cutlines
  apply_cutlines();

  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs
