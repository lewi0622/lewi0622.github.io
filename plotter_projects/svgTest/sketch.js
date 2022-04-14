type = 'svg';

gif = false;
fr = 30;

xoff = 0;
inc = 0.5*60/fr;


function setup() {
  common_setup(gif,SVG);
  frameRate(fr);
  background(255);
}
//***************************************************
function draw() {
  lines = 3;
  clear();
  push();
    for(let z=0; z<lines+1; z++){
      y_damp = 1;
      noise_off = 0;
      for(let j=0; j<5; j++){
        y_damp+=0.5;
        noFill();
        beginShape();
        for(let i=0; i<canvas_x; i+=canvas_x/40){
          y=floor(map(noise((i+xoff+noise_off*z)/100),0,1,-canvas_y/2, canvas_y/2)/y_damp);
          if(i==0){
            curveVertex(i, y);
          }
          curveVertex(i, y);
        }
        endShape();
      }
      translate(0, canvas_y/lines);
    }
  pop();
  xoff += inc;
  save_drawing('svg');
}
//***************************************************
//custom funcs




