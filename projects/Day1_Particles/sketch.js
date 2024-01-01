'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 10;

suggested_palettes = [SUMMERTIME]

let particles;

function gui_values(){
  parameterize("num_particles", 100, 1, 1000, 1, false);
  parameterize("x_speed", 10, 0.01, 50, 0.01, true);
  parameterize("max_y_movement", 5, 0, 50, 1, true);
  parameterize("max_weight", 5, 0, 50, 1, true);
  parameterize("rot_option", 0, 0, 2, 1, false);
}

function setup() {
  common_setup();
  background(color(0,0,0,255));
  particles = [];
}
//***************************************************
function draw() {
  global_draw_start(false);

  //actual drawing stuff
  push();
  const bg_c = color(0,0,0,30);
  background(bg_c);
  drawingContext.shadowBlur = 5*global_scale;
  if(particles.length<num_particles){
    particles.push({
      x:0,
      y:canvas_y/2,
      c:random(working_palette)
    })
  }

  for(let i=0; i<particles.length; i++){
    push();
    if(rot_option == 1) center_rotate(180*i);
    else if(rot_option == 2) center_rotate(random(360));
    let particle = particles[i];
    particle.x += random(x_speed);
    const y_movement = map(particle.x, 0, canvas_x, 0, max_y_movement);
    strokeWeight(map(particle.x, 0, canvas_x, 0, max_weight));
    particle.y += random(-y_movement, y_movement);

    stroke(particle.c);
    drawingContext.shadowColor = color(particle.c);

    point(particle.x, particle.y);
    pop();
  }

  for(let i=particles.length-1; i>=0; i--){
    if(particles[i].x>canvas_x) particles.splice(i,1);
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
