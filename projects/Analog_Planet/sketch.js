gif = false;
fr = 1;

capture = false;
capture_time = 10;
function setup() {
  suggested_palette = random([BEACHDAY, SUMMERTIME, NURSERY]);
  // common_setup(gif, P2D, base_x=450, base_y=800);
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

  weight = random(0.7, 1.5)*global_scale;

  strokeWeight(weight);
  strokeCap(SQUARE);

  radius = floor(random(75,150))*global_scale;
  translate(canvas_x/2, canvas_y/2);

  ang = floor(random(8))*45;
  rotate(ang);

  c1 = random(working_palette);
  reduce_array(working_palette, c1);
  c2 = random(working_palette);
  c3 = random(working_palette);

  blend_lines = random()>0.5;
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
      if(blend_lines){
        opacity = random(2,8);
        c1[3] = opacity;
        c2[3] = opacity;
        c3[3] = opacity;
      }

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
  apply_cutlines(bleed_border);
  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs