function setup() {
  common_setup();
}
//***************************************************
function draw() {
  //bleed
  bleed_border = apply_bleed();

  //apply background
  bg_c = bg(true);

  //actual drawing stuff
  push();

  center_rotate(random([0, 180]));

  noStroke();
  rect_width = canvas_x/4;
  rect_height = canvas_y*0.75;
  shape=random(['square', 'circle']);
  //best if even
  step = 2*global_scale;
  translate(canvas_x/16, 0);

  pow_arr = [0.5, 1.2, 3]
  pow_arr = shuffle(pow_arr);
  for(let i=0; i<3; i++){
    push();
    translate((canvas_x/16+canvas_y/4)*i, canvas_y/8);
  
    noise_matrix(rect_width, rect_height, step, true, true, 0, 1, pow_arr[i],  i, shape);
    pop();
  }

  pop();
  //cutlines
  apply_cutlines();
}
//***************************************************
//custom funcs
