function setup() {
  common_setup();
}
//***************************************************
function draw() {
  //set background, and remove that color from the palette
  bg = random(palette);
  background(bg);
  reduce_array(palette, bg);

  arcing(canvas_x);
  
  save_drawing();
}
//***************************************************
//custom funcs
function arcing(width){
  push();
  noFill();


  translate(canvas_x/2, canvas_y/2);
  let old_SW = 5*global_scale;
  let old_radius = canvas_x/20;
  let radius = 0;
  let angles = random(135,225);

  rotate(random(0, 360));
  while(radius < canvas_x-50*global_scale){
    radius = old_radius+old_SW*2+random(5,6)*global_scale;
    console.log(radius)
    sw = radius - old_radius - old_SW -5*global_scale;

    stroke(random(palette));
    strokeWeight(sw);
    console.log(sw)
    arc(0, 0, radius, radius, 0, angles);
    rotate(20);

    old_SW = sw;
    old_radius = radius;
  }
  pop();
}

