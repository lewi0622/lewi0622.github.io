'use strict';

function draw_diag(len){
    //draws a diagonal line
    if (random() >= 0.5){
      // top left to bottom right
      line(0, 0, len, len);
    }
    else{
      // top right to bottom left
      line(len, 0, 0, len);
    }
  }
  
function draw_cardinal(len){
  //draws a cardinal line
  if (random() >= 0.5){
    // vertical line
    line(len / 2, 0, len / 2, len);
  }
  else{
    // horizontal line
    line(0, len / 2, len, len / 2);
  }
}
  
function tile(x_tiles, y_tiles, length, funcs, colors=['#000000'], iterations=1, x_offset_min=0, x_offset_max=0, y_offset_min=0, y_offset_max=0){
  let i_offset = 0;
  let j_offset = 0;
  //loops through and calls given funcs across entire canvas
  for(let loop_num = 0; loop_num < iterations; loop_num++){
    i_offset += random(x_offset_min, x_offset_max);
    j_offset += random(y_offset_min, y_offset_max);

    for(let i = 0; i < x_tiles; i++){
      for(let j = 0; j < y_tiles; j++){
        if(i*length + i_offset > canvas_x + length || j*length + j_offset > canvas_y + length){
          break;
        }
        push();
        stroke(random(colors));
        translate(i*length + i_offset, j*length + j_offset);
        random(funcs)(length);
        pop();
      }
    }
  }
}


function center_rotate(deg){
  // rotate component before drawing by the center of the canvas
  translate(canvas_x/2, canvas_y/2);
  rotate(deg);
  translate(-canvas_x/2, -canvas_y/2);
}