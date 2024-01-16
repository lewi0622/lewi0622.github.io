'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 30;
const capture = false;
const capture_time = 10;

const suggested_palettes = [BEACHDAY, COTTONCANDY, BIRDSOFPARADISE, SOUTHWEST]

function gui_values(){
  parameterize("num_rows", 200, 1, 1000, 1, false);
  parameterize("num_cols", 200, 1, 1000, 1, false);
  parameterize("amp_noise", random(0.5,1.25), 0, 5, 0.1, true);
  parameterize("num_warps", 50, 0, 100, 1, false);
  parameterize("x_damp", random(50,200), 1, 500, 1, false);
  parameterize("y_damp", random(50,200), 1, 500, 1, false);
  parameterize("x_color_damp", random(200,600), 200, 1000, 1, false);
  parameterize("y_color_damp", random(200,600), 200, 1000, 1, false);
  parameterize("falloff", 1, 0, 1, 0.1, false);
}

function setup() {
  common_setup();
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();

  //apply background
  noStroke();
  working_palette = controlled_shuffle(working_palette, true);
  const bg_c = working_palette[working_palette.length - 1];
  background(bg_c);
  const num_colors = constrain(round(random(working_palette.length-1)), 2,4);
  const palette_placeholder = JSON.parse(JSON.stringify(working_palette));
  working_palette = [];
  for(let i=0; i<num_colors; i++) working_palette.push(palette_placeholder[i]);
  
  const y_offset = random(500, 2000);
  //actual drawing stuff
  push();
  translate(canvas_x / 8, canvas_y / 8);

  const row_step = canvas_y * 3/4 / num_rows;
  const col_step = canvas_x * 3/4 / num_cols;
  for(let i=0; i<num_rows; i++){
    for(let j=0; j<num_cols; j++){
      push();
      let x = j * col_step;
      let y = i * row_step;
      let amp = amp_noise;
      const c_index = map(pnoise.simplex2(x / x_color_damp, y / y_color_damp), -1,1, 0,1);
      const c_fill = color_map(c_index);

      for(let k=0; k<num_warps; k++){
        x += amp * pnoise.simplex2(x / x_damp,y / y_damp);
        y += amp * pnoise.simplex2(y_offset + x / x_damp, y_offset + y / y_damp);

        c_fill.setAlpha(lerp(100, 10, k / num_warps));

        fill(c_fill);

        let size_x = lerp(col_step*4, 0, k / num_warps);
        let size_y = lerp(row_step*4, 0, k / num_warps);
        ellipse(x, y, size_x, size_y);

        amp *= falloff;
      }
      pop();
    }
  }

  pop();
  
  global_draw_end();
}
//***************************************************
//custom funcs
function color_map(index){
  const color_step_size = 1/(working_palette.length-1);

  for(let i=0; i<working_palette.length; i++){
    let min_val = i * color_step_size;
    let max_val = (i + 1) * color_step_size;
    if(index>=min_val && index<max_val) return lerpColor(color(working_palette[i]), color(working_palette[i+1]), map(index, min_val, max_val, 0, 1));
  }
}