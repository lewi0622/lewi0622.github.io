'use strict';

let font;
function preload() {font = loadFont('..\\..\\fonts\\SquarePeg-Regular.ttf');}

//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 8;


function gui_values(){

}

function setup() {
  common_setup(110,85, SVG);
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  const x_div = 40*global_scale;
  const y_div = 22.5*global_scale;
  //margin applies to each edge
  const x_margin_size = 5*global_scale;
  const y_margin_size = 2.5*global_scale;

  //dividing line coordinates
  //first division is a half inch less due to the differnce between 9x12 and 8.5x11
  const x_div_0 = 35*global_scale;
  const x_div_1 = x_div_0 + x_div;

  //first division is quarter inch less due to the difference between 9x12 and 8.5x11
  const y_div_0 = 20*global_scale;
  const y_div_1 = y_div_0 + y_div;
  const y_div_2 = y_div_1 + y_div;

  //column divisions
  line(x_div_0, 0, x_div_0, canvas_y);
  line(x_div_1, 0, x_div_1, canvas_y);

  //row divisions
  line(0, y_div_0, canvas_x, y_div_0);
  line(0, y_div_1, canvas_x, y_div_1);
  line(0, y_div_2, canvas_x, y_div_2);

  //margin coords for upper left corner
  const x_margins = [0, x_div, x_div*2];
  const y_margins = [0, y_div, y_div*2, y_div*3];

  //draw margins
  for(let i=0; i<x_margins.length; i++){
    for(let j=0; j<y_margins.length; j++){
      push();
      translate(x_margins[i], y_margins[j]);
      //top margin
      line(0, 0, x_div-2*x_margin_size, 0);
      //bottom margin
      line(0, y_div-2*y_margin_size, x_div-2*x_margin_size, 0 + y_div-2*y_margin_size);
      //left margin
      line(0, 0, 0, y_div - 2 * y_margin_size);
      //right margin
      line(x_div - 2 * x_margin_size, 0, x_div - 2 * x_margin_size, y_div - 2 * y_margin_size);

      translate(0, y_div/2);
      stroke("BLUE")
      const letters = Array.from("LEWISTON");
      let max_x = 0;
      for(let i=0; i<letters.length; i++){
        translate(max_x, 0);
        const letter = letters[i];
        const points = font.textToPoints(letter, 0,0, 6*global_scale, {
          sampleFactor: 1,
          simplifyThreshold: 0
        });
        
        beginShape();
        max_x = 0; //reset max value
        points.forEach(p => {
          if(p.x>max_x) max_x = p.x;
          vertex(p.x, p.y);
        });
        endShape(CLOSE);
      }
      pop();
    }
  }


  pop();

  global_draw_end();
}
//***************************************************
//custom funcs


