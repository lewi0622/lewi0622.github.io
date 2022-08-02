gif = false;
fr = 1;

capture = false;
capture_time = 10;
function setup() {
  suggested_palette = random([BEACHDAY, BUMBLEBEE, NURSERY]);
  common_setup(gif);
}
//***************************************************
function draw() {

  capture_start(capture);
  //bleed
  bleed_border = apply_bleed();

  working_palette = JSON.parse(JSON.stringify(palette));

  //apply background
  bg_c = random(working_palette);  
  background(bg_c);
  reduce_array(working_palette, bg_c);

  //actual drawing stuff
  push();
  ang = floor(random(8))*45;
  center_rotate(ang);
  weight = random(0.7, 1.5)*global_scale;

  strokeWeight(weight);
  strokeCap(SQUARE);

  radius = floor(random(75,150))*global_scale;
  translate(canvas_x/2, canvas_y/2);
  c1 = random(working_palette);
  reduce_array(working_palette, c1);
  c2 = random(working_palette);
  c3 = random(working_palette);

  opacity = random(2,8);

  c1[3] = opacity;
  c2[3] = opacity;
  c3[3] = opacity;
  steps = radius*100;
  squish = random()*20*global_scale;
  blur = random([1, 2, 24]);
  if(blur == 24){
    squish = 0;
  }
  for(let i=-steps; i<steps; i++){
    push();
      y = radius * (i/steps);
      translate(0, y);

      //circle
      len = sqrt(sq(radius) - sq(y)) +squish;

      if(i<0){
        c = lerpColor(color(c2), color(c1), abs(i)/steps)
      }
      else{
        c = lerpColor(color(c1), color(c3), abs(i)/steps)
      }

      stroke(c);
      line(-len + random(-len, len)/blur,random(-len, len)/24, len + random(-len, len)/24,random(-len, len)/24);
    pop();
  }
  pop();
  //cutlines
  apply_cutlines();
  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs