gif = true;
fr = 30;

noiseMax = 1;
phase = 0;
phase_off = 20;
phase_inc = 1.5;

//***************************************************
function setup() {
  common_setup(gif);
  frameRate(fr);
  //apply background
  palette = shuffle(palette);
  bg_c = bg(true);
  weight = 2*global_scale;
  strokeWeight(weight);
  strokeCap(ROUND);
  // lines = floor(random(40, 100));
  lines =100;
  sub_lines = ceil(random(2, palette.length));
}
//***************************************************
function draw() {
  clear();
  c_id = 0;
  //bleed
  bleed_border = apply_bleed();
  //actual drawing stuff
  push();

  background(bg_c);
  translate(canvas_x/2, canvas_y/2);

  for(let i=0; i<360; i+=360/lines){
    push();
    min_len = 40*global_scale;

    xoff = map(cos(i+phase), -1,1, 0, noiseMax);
    yoff = map(sin(i+phase+phase_off), -1,1, 0, noiseMax);
    len = map(noise(xoff, yoff), 0,1, 100,250)*global_scale;

    sub_len = (len-min_len)*0.15;
    for(let j=0; j<sub_lines; j++){
      // calc pct of overall len to allocate to subline
      stroke(palette[c_id%palette.length])

      start_x = min_len*cos(i);
      start_y = min_len*sin(i);
  
      x = (sub_len+min_len)*cos(i);
      y = (sub_len+min_len)*sin(i);

      line(start_x, start_y, x,y);
      //loop cleanup
      min_len += sub_len + weight*2;
      c_id++;
      sub_len = (len-min_len)/sub_lines;
    }
    //loop cleanup
    c_id =0;
    pop();
  }

  phase+=phase_inc

  pop();
  noFill();
  
  //cutlines
  apply_cutlines();

}
//***************************************************
//custom funcs




