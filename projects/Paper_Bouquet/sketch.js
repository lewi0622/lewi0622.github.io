'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 5;
const capture = false;
const capture_time = 2;
const sixteen_by_nine = false;
let grid_bg_c;
suggested_palettes = [SIXTIES, SOUTHWEST, TOYBLOCKS];


function gui_values(){
  parameterize("x_padding", 50, 0, 400, 1, true);
  parameterize("num_shapes", floor(random(2,random(2, 120))), 2, 200, 1, false);
  parameterize("variation", random(100,200), 0, 400, 1, true);
  parameterize("num_points", floor(random(1,6)), 1, 20, 1, false);
  parameterize("damp", random(1,20), 1, 100, 1, false);
  parameterize("offset", 20, 0, 200, 1, false);
  parameterize("tightness", random(random(-5,0), random(0,5)), -5, 5, 0.01, false);
  parameterize("rotation", random(360), 0,360, 1, false);
  blend_mode = 6;
}

function setup() {
  common_setup();
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();
  //actual drawing stuff
  push();
  center_rotate(rotation);
  noStroke();
  curveTightness(tightness);
  background("#fffbf1")
  const startX = random(x_padding, x_padding*2);
  const startY = canvas_y/2;
  const endX = canvas_x-startX;
  const endY = canvas_y-startY;

  const start = createVector(startX, startY);
  const end = createVector(endX, endY);

  //less shapes, more alpha
  let c_alpha = map(num_shapes, 2,200, 175, 100)

  for(let i=0; i<num_shapes; i++){
    beginShape();
    const c=color(random(working_palette));
    //less alpha on top shapes than bottom
    let loop_alpha = (1-(i/num_shapes))*c_alpha;
    loop_alpha = constrain(loop_alpha, c_alpha*0.75, c_alpha);

    c.setAlpha(loop_alpha);
    fill(c);
    curveVertex(startX, startY);
    curveVertex(startX, startY);
    const var_div = 10;
    for(let j=0; j<num_points; j++){
      const mid_vec = p5.Vector.lerp(start, end, (j+1)/num_points);
      const x = mid_vec.x + random(-variation/var_div, variation/var_div);
      let y = mid_vec.y + map(noise(mid_vec.x+offset, i/damp), 0,1, 0, variation);
      y = random(y, canvas_y-y);
      curveVertex(x, y);
    }
    curveVertex(endX, endY);
    endShape();
  }
  pop();

  global_draw_end();
}
//***************************************************
//custom funcs
