function setup() {
  common_setup();
}

function draw() {
  //bleed
  bleed_border = apply_bleed();

  //apply background
  bg();

  //concentric backgrounds, remove last color from palette
  push();
  noStroke();
  border = random(palette);
  push();
  fill(border);
  rect(canvas_x/20, canvas_y/20, canvas_x - canvas_x/10, canvas_y - canvas_y/10);
  reduce_array(palette, border); 
  pop();

  //cutlines
  apply_cutlines();

  //actual drawing stuff
  
  let last_color = palette[0];
  let c = last_color;

  let thickness = 25*global_scale;
  let length = 100*global_scale;
  let lines = 3;
  let bars = 3;

  for (let i = 0; i<bars; i++){
    push();
    //get non_duplicate color
    while (c == last_color){
      c = random(palette)
    }
    //set opacity
    c[3] = floor(random(200, 240));
    //set color
    stroke(c);
    //set location
    translate(random(150*global_scale,275*global_scale), random(100*global_scale, 275*global_scale));

    //correct placement if rotated
    rotate(random([0, 90]));
    equals(lines, length, thickness);
    
    last_color = c;
    pop();     
  }
  save_drawing();
}
//***************************************************
//custom funcs
function equals(lines, length, thickness){

  strokeWeight(thickness);

  for (let i = 0; i < lines; i++){
    line(-length/2,0, length/2, 0);
    translate(0,thickness*1.5);
  }
}
