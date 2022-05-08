gif = false;
fr = 30;

noise_off = 20;
inc = 0.3*60/fr;

capture = false;
capture_time = 10;
function setup() {
  common_setup(gif, SVG);
  
  sym_angs = floor(random(4,17));
  line_segs = floor(random(5,15));

  len = 800/(line_segs*constrain(sym_angs, 4,8));

  noFill();
  strokeWeight(1*global_scale);
  colors = gen_n_colors(sym_angs);
}
//***************************************************
function draw() {
  capture_start(capture);
  //bleed
  bleed_border = apply_bleed();
  translate(canvas_x/2, canvas_y/2);

  //actual drawing stuff
  for(let i=0; i<sym_angs; i++){
    stroke(colors[i]);
    xoff = 0;
    for(let z=0; z<len; z++){
        push();
        beginShape();
        for(let j=0; j<line_segs; j++){
          dampening = map(noise(j), 0, 1, 10, 100);
          x = floor(map(noise((j + xoff)/dampening), 0, 1, -canvas_x*.5, canvas_x*.5));
          y = floor(map(noise((j + xoff + noise_off)/dampening), 0,1, -canvas_y*.5, canvas_y*.5));
          if(j == 0){
            curveVertex(x, y);
          }
          curveVertex(x, y);
        }
        endShape(CLOSE);
        pop();

      xoff+= inc;
    }
    rotate(360/sym_angs);
  }
  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs
