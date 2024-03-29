gif = true;
animation = true;
fr = 30;

xoff = 0;
inc = 0.005*60/fr;
offset = 50;
theta = 90;
theta_inc = 0.5*60/fr;

capture = false;
capture_time = 8;


function gui_values(){

}

function setup() {
  common_setup();
  gui_values();

  //apply background
  bg_c = random(working_palette);
  reduce_array(working_palette, bg_c);
  palette_reset = JSON.parse(JSON.stringify(controlled_shuffle(palette, true)));
  theta_offset = random(180);
}
//***************************************************
function draw() {
  global_draw_start();
  
  //actual drawing stuff
  push();
  background(bg_c);
  noFill();
  strokeWeight(map(sin(theta), -1, 1, 1, 40)*global_scale);

  grad = drawingContext.createLinearGradient(0,canvas_y/2,canvas_x,canvas_y/2);
  grad.addColorStop(0,color(palette[0]));
  grad.addColorStop(1,color(palette[1]));
  drawingContext.strokeStyle = grad;

  translate(0, canvas_y/2);

  beginShape();
  for(i=-canvas_x/2; i<canvas_x; i++){
    curveVertex(i, (sin(i+theta_offset+theta)/map(noise(i+xoff),0,1,1,4) + map(noise(i+xoff), 0, 1, -1, 1))*global_scale*8000);
  }
  endShape();

  xoff += inc;
  theta += theta_inc;
  pop();

  global_draw_end();
}
//***************************************************
//custom funcs




