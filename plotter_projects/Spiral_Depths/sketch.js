'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
suggested_palettes = [BEACHDAY, GAMEDAY, NURSERY]


function gui_values(){

}

function setup() {
  common_setup(6*96, 6*96, SVG);
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  center_rotate(random(360));

  createSpiral();

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs

const createSpiral = function(){
  push();
  noStroke();
  refresh_working_palette();
  const steps = 1000;    

  translate(canvas_x/2, canvas_y/2);
  const phi = random(1,255);
  const dist_scale = random(1.25,2.5);
  //50/50 circle or square.
  const circ = random()>0.5;
  const dir = random([1,-1]);
  for(let i=0; i<steps; i++){
    const f = i/steps;
    stroke("BLACK")
    fill("WHITE");
    const radius = sqrt(0.5);
    const angle = i * phi * dir;
    let smaller_cnv = min(canvas_x, canvas_y);   //find the smaller dimension

    const distance = f * radius * smaller_cnv*dist_scale;
    const x = cos(angle)*distance;
    const y = sin(angle)*distance;

    const size = map(f, 0,1,0,100)*global_scale;
    drawingContext.shadowBlur = size/floor(random(2,6));
    if(circ){
      circle(x,y, size);
    }
    else{
      square(x-size/2,y-size/2,size);
    }
  }
  pop();
}
