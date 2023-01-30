'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
suggested_palettes = [LASER];

let font;// opentype.js font object
let fSize; // font size
let msg; // text to write
let pts = []; // store path data
let path;

function gui_values(){

}

function setup() {
  common_setup(gif, SVG);
  opentype.load('..\\..\\fonts\\Roboto-Black.ttf', function (err, f) {
    if (err) {
      alert('Font could not be loaded: ' + err);
    } else {
      font = f
      console.log('font ready')
      draw();
    }
  })
}
//***************************************************
function draw() {
  if(!font) return

  capture_start(capture);
  //bleed
  const bleed_border = apply_bleed();

  //actual drawing stuff
  push();
  fSize = 200*global_scale;
  msg = getParamValue("text");
  if(msg == undefined) msg = "default"

  let x = 60
  let y = 300

  console.log(path)

  for(let i=0; i<5; i++){
    stroke(working_palette[i%(working_palette.length-1)]);
    path = font.getPath(msg, x, y, fSize)
    draw_open_type_js_path(path);
    fSize -= 10*global_scale;
  }

  pop();
  //cutlines
  apply_cutlines(bleed_border);

  capture_frame(capture);
}
//***************************************************
//custom funcs
function draw_open_type_js_path(path){  
  for (let cmd of path.commands) {
    if (cmd.type === 'M') { //move to
      beginShape();
      vertex(cmd.x, cmd.y);
    } 
    else if (cmd.type === 'L')vertex(cmd.x, cmd.y); //line to
    else if (cmd.type === 'C') bezierVertex(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y); // bezier to 
    else if (cmd.type === 'Q') quadraticVertex(cmd.x1, cmd.y1, cmd.x, cmd.y); //quadratic to
    else if (cmd.type === 'Z') endShape(CLOSE); // close shape
  } 
}