'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 30;
const capture = false;
const capture_time = 10;
let pts, stroke_c, bg_c, curved;

const suggested_palettes = [];

function gui_values(){
  parameterize("rows", 3, 1, 100, 1, false);
  parameterize("cols", 3, 1, 100, 1, false);
  parameterize("min_main_rad", 10, 1, 300, 5, true);
  parameterize("max_main_rad", 50, 1, 300, 5, true);
  parameterize("min_sec_rad", 10, 1, 300, 5, true);
  parameterize("max_sec_rad", 40, 1, 300, 5, true);
  parameterize("min_main_theta_per_loop", 10, 1, 300, 5, true);
  parameterize("max_main_theta_per_loop", 150, 1, 300, 5, true);
  parameterize("min_sec_theta_per_loop", 10, 1, 300, 5, true);
  parameterize("max_sec_theta_per_loop", 150, 1, 300, 5, true);
  parameterize("loops_per_spiro", 300, 0, 1500, 10, false);
}

function setup() {
  common_setup();

  curved = round(random());
  noFill();
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();

  //actual drawing stuff
  push();

  const col_step = canvas_x/cols;
  const row_step = canvas_y/rows;
  let spiro_color = 0;

  translate(max_main_rad, max_main_rad);

  for(let i=0; i<cols; i++){
    for(let j=0; j<rows; j++){
      push();
      stroke(spiro_color);
      spiro_color++;

      //initialize new spiro
      const main_rad = random(min_main_rad, max_main_rad);
      const sec_rad = random(min_sec_rad, max_sec_rad);
      const main_theta_per_loop = random(min_main_theta_per_loop, max_main_theta_per_loop);
      const sec_theta_per_loop = random(min_sec_theta_per_loop, max_sec_theta_per_loop);

      let main_theta = 0;
      let sec_theta = 0;
      //move to center of new spiro
      translate(i*col_step, j*row_step);

      beginShape();
      for(let i=0; i<loops_per_spiro; i++){    
        //main
        let x = main_rad * cos(main_theta);
        let y = main_rad * sin(main_theta);
        //sec
        x += sec_rad * cos(sec_theta);
        y += sec_rad * sin(sec_theta);
      
        main_theta += main_theta_per_loop;
        sec_theta += sec_theta_per_loop;

        if(curved) curveVertex(x, y);
        else vertex(x, y);
      }
      endShape();
      pop();
    }
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs