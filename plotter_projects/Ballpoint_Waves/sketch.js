'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 60;
const capture = false;
const capture_time = 50/fr;

const suggested_palettes = [];
function gui_values(){

}

let zoff = 0;
const z_inc = 0.01;
let rot_amt = 0;
let spread = 0;
let size = 0;
let current_x = 0;
let current_y = 0;

function setup() {
  common_setup();
  gui_values();
  noFill();
  randomize_params();
}
//***************************************************
function draw() {
  global_draw_start(false);
  push();
    const c = color("RED");
  c.setAlpha(40);
  stroke(c);
  lerp_coords();
  translate(current_x, current_y);
  rot_amt += random(1);
  rotate(rot_amt);
  const pts = 360;
  const angle_step = spread/pts;
  const noiseMax = 2;
  for(let j=0; j<2; j++){
    rotate(45);
    beginShape();
    for(let i=0; i<pts; i++){
      const theta = i * angle_step;
      const xoff = map(cos(theta), -1, 1, 0, noiseMax);
      const yoff = map(sin(theta), -1, 1, 0, noiseMax);
      const radius = map(noise(xoff, yoff, zoff), 0, 1, 0, height/2);
      const x = radius * cos(theta);
      const y = radius * sin(theta);
      vertex(x,y);
    }
    endShape();
  }
  zoff += z_inc;

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs
function randomize_params(){
  spread = random(45, 180);
  zoff = random(500);
  rot_amt = random(360);
  size = height * random(0.1, 1);
  current_x = mouseX;
  current_y = mouseY;
  if(mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height){
    current_x = width/2;
    current_y = height/2;
  }
}

function lerp_coords(){
    current_x = lerp(current_x, mouseX, 0.05);
    current_y = lerp(current_y, mouseY, 0.05);
}

function mouseClicked(){
  if(isLooping()) noLoop();
  else{
    randomize_params();
    loop();
  }
}

function keyPressed(){
  if(keyCode == ESCAPE) clear();
}