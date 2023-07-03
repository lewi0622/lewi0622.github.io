gif = false;
animation = false;
fr = 60;

xoff = 0;
xinc = 5;

capture = false;
capture_time = 10;


function gui_values(){

}

function setup() {
  common_setup();
  c = color(random(palette));
  background(c);
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  strokeWeight(1*global_scale);
  step = 20*global_scale;
  for(let j=0; j<canvas_y; j+=step){
    push();
    c = color(random(palette));
    stroke(c);
    fill(c);
    translate(0, j);
    beginShape();
    for(let i=-canvas_x/2; i<canvas_x*1.5; i+=step){
      curveVertex(i, random(0,40*global_scale));
    }
    curveVertex(canvas_x*1.5, canvas_y*1.5);
    curveVertex(-canvas_x/2, canvas_y*1.5);
    endShape(CLOSE);
    pop();
  }
  pop();

  global_draw_end();
}
//***************************************************
//custom funcs


