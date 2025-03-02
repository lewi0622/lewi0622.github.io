'use strict';
//setup variable
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 5;

const suggested_palettes = [];
let font, bg_c;

function gui_values(){
  parameterize("text_size", 500, 1, 1000, 1, true);
  parameterize("num_letters", 10, 1, 100, 1, false);
  parameterize("location_variance", 0.05, 0, 10, 0.01, false);
} 

function setup() {
  common_setup();
  gui_values();
  if(!redraw){
    opentype.load('..\\..\\fonts\\Porcine-Heavy.ttf', function (err, f) {
      if (err) {
        alert('Font could not be loaded: ' + err);
      } else {
        font = f;
        draw();
      }
    })
  }
  bg_c = png_bg(true);
  stroke(random(working_palette));
}
//***************************************************
function draw() {
  if(!font) return;
  global_draw_start();

  //actual drawing stuff
  push();
  background(bg_c);
  noFill();
  refresh_working_palette();
  const letters = "STOP";
  let line1 = font.getPath(letters, 0,0, text_size);
  let x_min = canvas_x;
  let x_max = -canvas_x;
  let y_min = canvas_y;
  let y_max = -canvas_y;
  for (let cmd of line1.commands) {
    if(cmd.x<x_min) x_min = cmd.x;
    if(cmd.x>x_max) x_max = cmd.x;
    if(cmd.y<y_min) y_min = cmd.y;
    if(cmd.y>y_max) y_max = cmd.y;
  }

  translate((canvas_x-x_max-x_min)/2, (canvas_y-y_max-y_min)/2);
  for(let i=0; i<num_letters; i++){
    push();
    translate(random(-location_variance, location_variance)*text_size, random(-location_variance, location_variance)*text_size);
    rotate(random(-1,1));
    line1 = font.getPath(letters, 0,0, random(text_size*0.9, text_size));
    draw_letter(line1);
    pop();
  }
  pop();

  global_draw_end();
}
//***************************************************
//custom funcs
function draw_letter(path){
  for (let cmd of path.commands) {
    if (cmd.type === 'M') { //move to
      beginShape();
      vertex(cmd.x, cmd.y);
    } 
    else if (cmd.type === 'L')vertex(cmd.x, cmd.y); //line to
    else if (cmd.type === 'C') bezierVertex(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y); // bezier to 
    else if (cmd.type === 'Q') quadraticVertex(cmd.x1, cmd.y1, cmd.x, cmd.y); //quadratic to
    else if (cmd.type === 'Z'){
      endShape(CLOSE); // close shape
    }
  } 
}