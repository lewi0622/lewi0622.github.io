'use strict';

//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;


function gui_values(){
  parameterize("number_of_lines", 100, 1, 100, 1, false);
  parameterize("y_margin", 70, 0, 100, 1, true);
  parameterize("line_segments", 250, 1, 500, 1, false);
  parameterize("step_amplitude", 1, 0.1, 10, 0.1, true);
  parameterize("max_noise_amplitude", 80, 0, 200, 1, true);
  parameterize("i_noise_damp", 1, 1, 1000, 1, false);
  parameterize("j_noise_damp", 45, 1, 1000, 1, false);
}

function setup() {
  common_setup(4*96, 6*96, SVG);
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  
  const line_step_size = (canvas_y-y_margin*2)/number_of_lines;
  const segment_step_size = canvas_x/line_segments;

  translate(0, y_margin);

  for(let i=0; i<number_of_lines; i++){
    push();
    translate(0, line_step_size*i);

    beginShape();
    vertex(-canvas_x/4, 0);//start offscreen to the left
    let noise_amplitude = 0;
    for(let j=0; j<line_segments; j++){
      if(j/line_segments<0.3 || j/line_segments>0.7) noise_amplitude = 0;
      else if(j/line_segments<0.5) noise_amplitude = constrain(noise_amplitude + step_amplitude, 0, max_noise_amplitude); //increase amplitude gradually
      else noise_amplitude = constrain(noise_amplitude - step_amplitude, 0, max_noise_amplitude); //decrease amplitude gradually
      const y = map(noise(i/i_noise_damp,j/j_noise_damp), 0,1, -noise_amplitude,noise_amplitude);
      vertex(j*segment_step_size, y); 
    }
    vertex(canvas_x*1.25,0);//offscreen to the right
    vertex(canvas_x*1.25,canvas_y*1.25);//offscreen to the bottom right
    vertex(-canvas_x*0.25, canvas_y*1.25);//offscreen to the bottom left

    endShape(CLOSE);//complete shape offscreen
    pop();
  }

  pop();

  global_draw_end();
}
//***************************************************
//custom funcs