'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 120;
const capture = false;
const capture_time = 10;

let k;
let y_offset;
let noise_map;
let total_loops;

const suggested_palettes = [BEACHDAY, COTTONCANDY, SOUTHWEST, SIXTIES];

function gui_values(){
  parameterize("num_rows", 200, 1, 1000, 1, false);
  parameterize("num_cols", 200, 1, 1000, 1, false);
  parameterize("amp", random(0.5,1.5), 0, 5, 0.1, false);
  parameterize("num_warps", 50, 0, 100, 1, false);
  parameterize("x_damp", random(15,40), 1, 100, 1, false);
  parameterize("y_damp", random(15,40), 1, 100, 1, false);
  parameterize("x_color_damp", random(50,150), 0, 500, 1, false);
  parameterize("y_color_damp", random(50,150), 0, 500, 1, false);
  parameterize("falloff", 1, 0, 1, 0.1, false);
}

function setup() {
  common_setup();

  k=0;
  noise_map = [];

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
  
  y_offset = random(500, 2000);

  for(let i=0; i<num_rows; i++){
    for(let j=0; j<num_cols; j++){
      let x = j;
      let y = i;
      const c_index = map(pnoise.simplex2(x / x_color_damp, y / y_color_damp), -1,1, 0,1);
      noise_map.push({
        x:x,
        y:y,
        c:color_map(c_index)
      })
    }
  }

  total_loops = num_warps * noise_map.length;

  loop();
}
//***************************************************
function draw() {
  global_draw_start(false);

  if(k+2 == total_loops) noLoop();
  
  //actual drawing stuff
  push();
  translate(canvas_x / 8, canvas_y / 8);

  const row_step = canvas_y * 3/4 / num_rows;
  const col_step = canvas_x * 3/4 / num_cols;
  for(let i=k; i<k+1000; i++){
    const actual_k = floor(k/noise_map.length);
    let e = noise_map[i%noise_map.length];
    e.x += amp * pnoise.simplex2(e.x / x_damp, e.y / y_damp);
    e.y += amp * pnoise.simplex2(y_offset + e.x / x_damp, y_offset + e.y / y_damp);

    e.c.setAlpha(lerp(100, 10, actual_k / num_warps));

    fill(e.c);

    //values past this point are scaled
    let size_x = lerp(col_step*4, 0, actual_k / num_warps);
    let size_y = lerp(row_step*4, 0, actual_k / num_warps);

    ellipse(e.x * col_step, e.y * row_step, size_x, size_y);
  }

  k += 1000;

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