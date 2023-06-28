'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
suggested_palettes = [BIRDSOFPARADISE, SIXTIES, SUPPERWARE]

function gui_values(){
  parameterize("tile_div", random(70, 300), 1, 400, 1, false);
  parameterize("amp_start", random(15, 20), 10, 50, 0.1, true);
  parameterize("tightness", random(4,5), -5, 5, 0.1, false);
}

function setup() {
  common_setup();
}
//***************************************************
function draw() {
  global_draw_start();

  refresh_working_palette();

  //apply background
  let bg_c;
  print(global_palette_id)
  if(global_palette_id == 6) bg_c = working_palette[7];
  else if(global_palette_id == 12) bg_c = working_palette[0];
  else if(global_palette_id == 14) bg_c = working_palette[5];
  else bg_c = random(working_palette)
  background(bg_c)
  reduce_array(working_palette, bg_c)

  //actual drawing stuff
  push();
  noFill();
  const num_lines = floor(canvas_y/amp_start/2)-2;
  const tile_x = canvas_x/tile_div;
  strokeWeight(1.25*global_scale);
  const margin_y = random(30, 60)*global_scale;
  stroke(random(working_palette));

  //space between words
  const space_size = amp_start/4;

  //reset y position
  let current_y = margin_y;
  let word_count = 0;
  for(let j=0; j<num_lines; j++){
    push();
    const margin_x = 60*global_scale;

    //reset x position
    let current_x = margin_x;
    while(current_x<canvas_x-margin_x*2){
      push();
      translate(current_x, current_y);
      const word_len = random(5, 20);
      if(j ==0) translate(0, -amp_start/2);
      if(j == num_lines-1) translate(random(canvas_x-margin_x*2), amp_start);

      //average sentence is 15-20 words
      //maybe use 1-2 commas between punctuation
      //1 em dash every once in a great while
      //multi line signature?

      beginShape();
      curveTightness(tightness);
      curveVertex(random(-10,5)*global_scale,0);
      curveVertex(random(-10,5)*global_scale,0);
      let x_movement;
      for(let i = 0;  i<word_len; i++){
        const l_r = random([-1,1,1])*tile_x*3;
        const u_d = random([-1,1])*random([amp_start*3/4, amp_start*3/4, amp_start]);
        x_movement = i*tile_x+noise(i+j)*l_r;
        curveVertex(x_movement, noise(i+j)*u_d);
      }
      endShape();

      word_count++

      //move by word lenght plus some space
      current_x += x_movement + space_size;
      pop();

      //chance for punctuation
      if((j == num_lines -2 && current_x>canvas_x-margin_x*2)  || word_count>8 && random()>map(word_count, 0,20, 1, 0.8)){
        push();
        //period
        translate(current_x - space_size, current_y + amp_start/2);
        beginShape();
        curveVertex(0, 0);
        curveVertex(0, 0);
        for(let i=0; i<2; i++){
          curveVertex(random(-1,1)*global_scale, random(-0.25, 0.25)*global_scale);
        }
        endShape();
        pop();
        if(random()>0.75){
          //exlcamation
          push();
          translate(current_x - space_size, current_y + amp_start/2-4*global_scale);
          beginShape();
          curveVertex(0,0);
          curveVertex(0,0);
          curveVertex(random(0,4*global_scale), random(0.5, 1)*(-amp_start));
          curveVertex(4*global_scale, -amp_start);
          endShape();
          pop();
        }
        else if(random()>0.75){
          //question mark
          push();
          translate(current_x - space_size, current_y + amp_start/2-4*global_scale);
          curveTightness(random(-1, 0.5));
          rotate(random(-5,5));
          beginShape();
          curveVertex(0,0);
          curveVertex(0,0);
          curveVertex(0, random(0.9,1.1)*(-amp_start/3));
          curveVertex(random(0.9,1.1)*6*global_scale, -amp_start*3/4);
          curveVertex(0, random(0.9,1.1)*(-amp_start));
          curveVertex(0, random(0.9,1.1)*(-amp_start/2));
          endShape();
          pop();
        }
        translate(global_scale*10, 0);
        word_count = 0;
      }
      if(j == 0 && (word_count > 1 && random()>0.2)|| j == num_lines-1) break;
      if(random()>0.98){
        //underline
        push();
        curveTightness(0);
        translate(current_x - x_movement + space_size, current_y + amp_start*3/4);
        beginShape();
        const y_start = random(-1,1)*amp_start/4;
        curveVertex(0,y_start);
        curveVertex(0,y_start);
        for(let i=0; i<5; i++){
          curveVertex(x_movement*i/5, random(-1,1)*amp_start/16 + y_start)
        }
        endShape();
        pop();
      }
    }
    current_y += amp_start*2;
    pop();
  }
  //grain
  pop();
  push();
  noFill();
  stroke("#f3f0de");
  // stroke(random(working_palette));
  strokeWeight(global_scale*0.006);
  for(let i=0; i<60000; i++){
    circle(random(-canvas_x/2, canvas_x*1.5), random(-canvas_y/2, canvas_y*1.5), canvas_x/2);
  }
  pop();
  
  global_draw_end();
}
//***************************************************
//custom funcs
