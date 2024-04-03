'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 30;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

let font;

function gui_values(){
  parameterize('inc', 0.1, 0.001, 1, 0.001, false);
  parameterize("zinc", 0.1, 0, 1, 0.01, false);
  parameterize("scl", 10, 1, 100, 1, true);
  parameterize("z_iterations", 1, 1, 25, 1, false);
  parameterize("fSize", 20, 1, 100, 1, true);
}

function setup() {
  common_setup();
  gui_values();

  opentype.load('..\\..\\fonts\\SquarePeg-Regular.ttf', function (err, f) {
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
  global_draw_start();
  if(font == undefined) return;
  const letters = ":D".split("");
  const letter_paths = [];
  letters.forEach(letter => {
    letter_paths.push(font.getPath(letter, 0,0, fSize));
  });

  let rows = floor(canvas_y / scl);
  let cols = floor(canvas_x / scl);
  //actual drawing stuff

  let c1 = color("RED");
  let c2 = color("BLUE");
  c1.setAlpha(100);
  c2.setAlpha(100);
  stroke(c1);

  push();
  let zoff=0;
  for(let z=0; z<z_iterations; z++){
    if(z==1)stroke(c2);
    let yoff=0;
    for(let y=0; y<rows; y++){
      let xoff=0;
      for(let x=0; x<cols; x++){
        let angle = noise(xoff, yoff, zoff) * 360;
        let v = p5.Vector.fromAngle(radians(angle));
        xoff += inc; 
        push();
        translate(x*scl, y*scl);
        rotate(degrees(v.heading()));
        // line(0,0,scl,0);
        const letter_path = letter_paths[(x+y)%letter_paths.length];
        draw_open_type_js_path_p5_commands(letter_path);
        pop();
      }
      yoff += inc;
    }
    zoff += zinc;
  }
  pop();
  
  global_draw_end();
}
//***************************************************
//custom funcs