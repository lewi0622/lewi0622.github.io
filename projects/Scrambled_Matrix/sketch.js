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
  center_rotate(random([0,90,180,270]));

  step=20*global_scale;
  square_size = 30*global_scale;
  x_off = canvas_x/8 + square_size/2;
  y_off = canvas_y/8 + square_size/2;


  isFill=false;
  noFill();
  for(let i=0; i*step<canvas_x-x_off*2; i++){
    push();
    c = random(palette);
    stroke(c);

    for(let j= 0; j*step<canvas_y-y_off*2; j++){
      if(random([0,1,2])==0){
        fill(c);
        isFill=true;
      }
      else{
        noFill();
        isFill=false;
      }

      loop_noise = noise(i+j)*random([-1,1]);
      strokeWeight(random(1,5)*global_scale);

      push();
      translate(i*step+x_off, j*step+y_off);
      square(0, 0, loop_noise*square_size);
      if(isFill==true){
        stroke(bg_c);
        translate(loop_noise*square_size/4, loop_noise*square_size/4)
        square(0,0, loop_noise*square_size/2);
      }
      pop();
    }
    pop();
  }

  pop();
  //cleanup
  apply_cutlines();
  save_drawing();
}
//***************************************************
//custom funcs


