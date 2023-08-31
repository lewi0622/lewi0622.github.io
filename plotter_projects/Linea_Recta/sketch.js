'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

let x_fourth, y_fourth, copic_palette;
suggested_palettes = []

function gui_values(){
  parameterize("circle_segments", 50, 3, 1000, 1, false);
  parameterize("circle_radius", 100, 1, 1000, 1, true);
  parameterize("min_line_length", 10, 1, 1000, 1, true);
  parameterize("max_line_length", 10, 1, 1000, 1, true);
  parameterize("ang", 10, 0, 180, 1, false);
  parameterize("x_noise_damp", 100, 1, 1000,1, false);
  parameterize("y_noise_damp", 100, 1, 1000,1, false);
} 

function setup() {
  common_setup(6*96, 6*96, SVG);
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();

  //actual drawing stuff
  push();

  //ADD CYLINDERS OPTION INSTEAD OF LINES AND PERFORM OCCULT

  translate(canvas_x/2, canvas_y/2);
  noFill();
  const directions = ["up", "down", "left", "right"];
  const rotations = [random(-ang,ang), random(-ang,ang), random(-ang,ang), random(-ang,ang)]
  const colors = ["YELLOW", "MAGENTA", "CYAN", "BLACK"]
  for(let i=0; i<colors.length; i++){
    colors[i] = color(colors[i]);
    colors[i].setAlpha(120);
  }
  directions.push(random(directions));
  
  for(let i=0; i<circle_segments; i++){
    push();
    const theta = 360/circle_segments*i;
    const x = circle_radius * cos(theta);
    const y = circle_radius * sin(theta);
    translate(x,y);
    const line_length = map(noise(x/x_noise_damp,y/y_noise_damp),0,1, min_line_length,max_line_length);
    const current_direction = random(directions);
    switch(current_direction){
      case("up"):
      rotate(rotations[0]);
      // stroke(colors[0]);
      line(0,0, 0,-line_length);
      break;
      case("down"):
      rotate(rotations[1]);
      // stroke(colors[1]);
      line(0,0, 0,line_length);
      break;
      case("left"):
      rotate(rotations[2]);
      // stroke(colors[2]);
      line(0,0, -line_length, 0);
      break;
      case("right"):
      rotate(rotations[3]);
      // stroke(colors[3]);
      line(0,0, line_length, 0);
      break;
      default:
      break;
    }
    directions.pop();
    directions.push(current_direction);
    pop();
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
