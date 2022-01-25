gif = true;
fr = 60;

xoff = 0;
inc = 0.005;
offset = 50

//***************************************************
function setup() {
  common_setup(gif);
  frameRate(fr);
  //apply background
  bg_c = bg(true);
  palette_reset = JSON.parse(JSON.stringify(shuffle(palette)));
  // createLoop({duration:1.5, gif:{fileName:"instanceMode.gif"}})
}
//***************************************************
function draw() {
  if(gif){
    clear();
    background(bg_c);
    palette = palette_reset;
  }
  //bleed
  bleed_border = apply_bleed();
  //actual drawing stuff
  push();

  noFill();
  strokeWeight(3*global_scale);
  translate(canvas_x/2, canvas_y/2);
  //shadow
  drawingContext.shadowBlur = noise(xoff)*global_scale*10;

  for(let i=0; i<map(noise(xoff), 0, 1, 10, 110); i++){
    c = color(palette[i%Math.min(3, palette.length)])
    drawingContext.shadowColor = c;
    stroke(c)
    circle(0,0, map(noise(xoff+offset*i), 0, 1, -100, 600)*global_scale);
  }  

  xoff += inc;
  pop();
  noFill();
  
  erase();
  cutoutCircle(canvas_y/128);
  noErase();
  //cutlines
  apply_cutlines();
  
  save_drawing();
}
//***************************************************
//custom funcs




