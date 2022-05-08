gif = true;
fr = 30;

noiseMax = 1;
phase = 0;
phase_off = 20;
phase_inc = 1.5;

capture = false;
capture_time = 5
function setup() {
  common_setup(gif);
  change_default_palette(random([BEACHDAY, SOUTHWEST, SUPPERWARE]));

  //styling
  palette = shuffle(palette);
  bg_c = bg(true);
  weight = 2*global_scale;
  strokeWeight(weight);
  strokeCap(ROUND);
  noFill();
  c_id = 0;

  lines = floor(random(40, 100));
  sub_lines = ceil(random(2, palette.length));
}
//***************************************************
function draw() {
  capture_start(capture);

  clear();
  //reset loop variables
  min_len = (sin(phase)*4+40)*global_scale;
  background(bg_c);

  //bleed
  bleed_border = apply_bleed();
  //actual drawing stuff
  push();

  translate(canvas_x/2, canvas_y/2);
  stroke(palette[c_id])
  circle(0,0,min_len*2);

  for(let i=0; i<360; i+=360/lines){
    xoff = map(cos(i+phase), -1,1, 0, noiseMax);
    yoff = map(sin(i+phase+phase_off), -1,1, 0, noiseMax);
    len = map(noise(xoff, yoff), 0,1, 100,250)*global_scale;

    //subline precalc
    sub_len = (len-min_len)*0.15;
    sub_min_len = min_len;
    cos_i = cos(i);
    sin_i = sin(i);
    for(let j=0; j<sub_lines; j++){
      stroke(palette[c_id])

      start_x = sub_min_len*cos_i;
      start_y = sub_min_len*sin_i;
  
      x = (sub_len+sub_min_len)*cos_i;
      y = (sub_len+sub_min_len)*sin_i;

      line(start_x, start_y, x,y);

      //loop cleanup
      sub_min_len += sub_len + weight*2;
      c_id++;
      sub_len = (len-sub_min_len)/sub_lines;
    }
    //loop cleanup
    c_id =0;
  }

  phase+=phase_inc

  pop();
  
  //cutlines
  apply_cutlines();

  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs