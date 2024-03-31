'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 8;

let font, bg_c, stroke_c;
let z=0; 
const z_inc = 0.01;

function gui_values(){
  parameterize("font_size", 50, 1, 400, 1, true);
  parameterize("amp", 1, 0, 100, 1, true);
}

function setup() {
  common_setup();
  gui_values();

  if(!redraw){
    opentype.load('..\\..\\fonts\\PeachyRoseRegular-w1xpw.ttf', function (err, f) {
      if (err) {
        alert('Font could not be loaded: ' + err);
      } else {
        font = f;
        draw();
      }
    })
  }
  bg_c = png_bg(true);
  stroke_c = random(working_palette);
}
//***************************************************
function draw() {
  if(!font) return;
  global_draw_start();

  push();
  background(bg_c);
  stroke(stroke_c);
  strokeWeight(1*global_scale);
  line_blur(color(stroke_c), 2*global_scale);
  noFill();
  let msg = "ERIC"; // text to write
  let path = font.getPath(msg, 0,0, font_size);

  let bbox = path.getBoundingBox();
  translate((canvas_x - bbox.x2 - bbox.x1)/2, (canvas_y - bbox.y2 - bbox.y1)/2);

  const point_counter = 0;
  for (let cmd of path.commands) {
    if(cmd.x != undefined) cmd.x += map(noise(cmd.x/global_scale/100, z), 0,1, -amp,amp);
    if(cmd.y != undefined) cmd.y += map(noise(cmd.y/global_scale/100, z), 0,1, -amp,amp);
    if(cmd.x1 != undefined) cmd.x1 += map(noise(cmd.x1/global_scale/100, z), 0,1, -amp,amp);
    if(cmd.y1 != undefined) cmd.y1 += map(noise(cmd.y1/global_scale/100, z), 0,1, -amp,amp);
    if(cmd.x2 != undefined) cmd.x2 += map(noise(cmd.x2/global_scale/100, z), 0,1, -amp,amp);
    if(cmd.y2 != undefined) cmd.y2 += map(noise(cmd.y2/global_scale/100, z), 0,1, -amp,amp);

    if (cmd.type === 'M') { //move to
      beginShape();
      vertex(cmd.x, cmd.y);
    } 
    else if (cmd.type === 'L')vertex(cmd.x, cmd.y); //line to
    else if (cmd.type === 'C') bezierVertex(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y); // bezier to 
    else if (cmd.type === 'Q') quadraticVertex(cmd.x1, cmd.y1, cmd.x, cmd.y); //quadratic to
    else if (cmd.type === 'Z') endShape(CLOSE); // close shape
  } 
  z += z_inc;
  pop();
  global_draw_end();
}
//***************************************************
//custom funcs