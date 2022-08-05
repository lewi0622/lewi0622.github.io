gif = true;
noiseMax = 2;
phase = 0;
phase_off = 20;
phase_inc = 0.01;
fr = 1;
c_offset = 0;

capture = false;
capture_time = 8;
function setup() {
  common_setup(gif, SVG);

  noFill();
  weight = 10*global_scale;
  strokeWeight(weight);
  strokeCap(ROUND);
  angleMode(DEGREES);
}
//***************************************************
function draw() {
  clear();
  //bleed
  bleed_border = apply_bleed();

  //actual drawing stuff
  push();
  blur = 20;

  translate(canvas_x, canvas_y);
  line_dist = weight*3/4;
  x_offset = 80*global_scale;
  y_offset = -80*global_scale;

  c_loop = c_offset;

  for(let j=0; j<40; j++){
    c = palette[c_loop%palette.length];
    c_loop++;
    // c[3] = 100;
    stroke(c);
    for(let i=0; i<40; i++){
      push();
      translate(-line_dist*i, -line_dist*j);
      if(random()>0.7){
        line(0,0,x_offset,y_offset);
      }
      pop();
    }
  }
  filter(BLUR, 3);

  c_offset++;

  pop();
  //cleanup
  apply_cutlines(bleed_border);
}
//***************************************************
//custom funcs