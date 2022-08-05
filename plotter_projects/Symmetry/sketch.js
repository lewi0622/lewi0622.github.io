//setup variables
const gif = false;
const fr = 30;
const capture = false;
const capture_time = 10;

function setup() {
  common_setup(gif, SVG);
}
//***************************************************
function draw() {
  capture_start(capture);

  //project variables
  const noise_off = 20;
  const inc = 0.3*60/fr;
  const sym_angs = floor(random(4,17));
  const line_segs = floor(random(5,15));

  const len = 800/(line_segs*constrain(sym_angs, 4,8));

  noFill();
  strokeWeight(1*global_scale);
  const colors = gen_n_colors(sym_angs);

  //bleed
  const bleed_border = apply_bleed();
  translate(canvas_x/2, canvas_y/2);

  //actual drawing stuff
  for(let i=0; i<sym_angs; i++){
    stroke(colors[i]);
    let xoff = 0;
    for(let z=0; z<len; z++){
        push();
        beginShape();
        for(let j=0; j<line_segs; j++){
          const dampening = map(noise(j), 0, 1, 10, 100);
          const x = floor(map(noise((j + xoff)/dampening), 0, 1, -canvas_x*.5, canvas_x*.5));
          const y = floor(map(noise((j + xoff + noise_off)/dampening), 0,1, -canvas_y*.5, canvas_y*.5));
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

  //cleanup
  apply_cutlines(bleed_border);

  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs
