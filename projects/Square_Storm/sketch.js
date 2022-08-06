gif = true;
fr = 30;

capture = false;
capture_time = 5;

squares = [];
num_squares = 1000;
ang = 0;
ang_inc = 1;
function setup() {
  suggested_palette = random([SUMMERTIME, SOUTHWEST, NURSERY, JAZZCUP]);
  common_setup(gif);
  for(let i=0; i<num_squares; i++){
    c = random(palette);
    c[3] = 0.05*255;
    squares.push({x:random(-canvas_x/8, canvas_x*9/8), y:random(-canvas_y/8, canvas_y*9/8), c: c});
  }
  //rotation point
  origin = random(["tl", "tr", "center", "bl", "br"]);
}
//***************************************************
function draw() {
  clear();
  capture_start(capture);
  //bleed
  const bleed_border = apply_bleed();

  working_palette = JSON.parse(JSON.stringify(palette));

  //apply background
  background("WHITE");

  noStroke();
  //actual drawing stuff
  push();
  size = 200*global_scale;
  corner = 20*global_scale;

  switch(origin){
    case "br":
      translate(canvas_x, canvas_y);
      break;
    case "bl":
      translate(0, canvas_y);
      break;
    case "center":
      translate(canvas_x/2, canvas_y/2);
      break;
    case "tr":
      translate(canvas_x, 0);
      break;
    default:
      break;
  }

  for(let i=0; i<num_squares; i++){
    push();
    rotate(ang+i);
    translate(squares[i].x, squares[i].y);
    rotate(-ang);
    fill(squares[i].c);
    square(0,0, size+map(noise((i+ang)/100), 0,1, -size/4,size/4), corner, corner, corner, corner);
    pop();
  }
  ang += ang_inc;
  pop();
  //cutlines
  apply_cutlines(bleed_border);
  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs
