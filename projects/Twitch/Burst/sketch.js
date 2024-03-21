'use strict';
//setup variables
const gif = true;
const animation = true;
const fr = 30;
const capture = false;
const capture_time = 2;

const suggested_palettes = [BIRDSOFPARADISE];

let bg_c, line_c, confetti_c, shadow_c;

let weight;

let phase_1_counter, phase_2_counter, phase_3_counter,phase_4_counter, phase_5_counter, phase_6_counter;
const phase_1_max = 10;
const phase_4_max = 30;

let font;
function preload() { font = loadFont('..\\..\\..\\fonts\\SquarePeg-Regular.ttf'); }

function gui_values(){
  // parameterize("weight", 200, 1, 200, 1, true);
}

function setup() {
  common_setup();
  gui_values();
  //parameter
  weight = 150*global_scale;

  //counters
  phase_1_counter = 0;
  phase_2_counter = 0;
  phase_3_counter = 0;
  phase_4_counter = 0;
  phase_5_counter = 0;
  phase_6_counter = 0;

  //colors
  refresh_working_palette();
  bg_c = random(working_palette);
  reduce_array(working_palette, bg_c);

  line_c = random(working_palette);
  reduce_array(working_palette, line_c);

  confetti_c = random(working_palette);
  reduce_array(working_palette, confetti_c);

  shadow_c = color("#262626");

  textFont(font);
  textSize(200*global_scale);
}
//***************************************************
function draw() {
  global_draw_start();

  push();
  background(bg_c);
  strokeCap(ROUND);
  strokeWeight(weight);
  stroke(line_c);
  center_rotate(-45);

  drawingContext.shadowBlur = 1*global_scale;
  drawingContext.shadowColor = color(shadow_c);
  drawingContext.shadowOffsetX = 2.5*global_scale;
  drawingContext.shadowOffsetY = 2.5*global_scale;

  const weight_reduction = 20*global_scale;

  if(phase_1_counter<=phase_1_max){ //move in
    const x_start = lerp(canvas_x, canvas_x/2, phase_1_counter/phase_1_max);
    line(x_start, canvas_y/2, canvas_x, canvas_y/2);
    phase_1_counter++;
  }
  else if(phase_2_counter<=phase_1_max){ //to center circle
    const x_end = lerp(canvas_x, canvas_x/2, phase_2_counter/phase_1_max);
    line(canvas_x/2, canvas_y/2, x_end, canvas_y/2);
    phase_2_counter++;
  }
  else if(phase_3_counter<=phase_1_max){ //circle pulse
    if(phase_3_counter/phase_1_max < 0.5) weight -= weight_reduction;
    else weight += weight_reduction;
    line(canvas_x/2, canvas_y/2, canvas_x/2, canvas_y/2);
    phase_3_counter++;
  }
  else if(phase_4_counter<=phase_4_max){ //confetti
    push();
    center_rotate(45);

    const ang_step = 360/12;
    const line_len = 100*global_scale;
    const x_start = lerp(0, canvas_x/2, phase_4_counter/phase_1_max);

    for(let i=0; i<12; i++){
      push();
      strokeCap(SQUARE);
      stroke(confetti_c);
      strokeWeight(weight/10);

      translate(canvas_x/2, canvas_y/2);
      rotate(i*ang_step);

      line(x_start, 0, x_start + line_len, 0);
      pop();
    }
    line(canvas_x/2, canvas_y/2, canvas_x/2, canvas_y/2);
    push();
    translate(canvas_x/2-140*global_scale, canvas_y/2-40*global_scale);
    rotate(80);
    strokeWeight(1*global_scale);

    stroke("BLACK");
    text(":D", 0, -78*global_scale)
    pop();
    
    phase_4_counter++;
    pop();
  }
  else{
    randomize_seed();
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs
