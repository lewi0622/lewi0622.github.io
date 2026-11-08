'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const suggested_palettes = [BIRDSOFPARADISE, SIXTIES, SUPPERWARE]

function gui_values(){
  parameterize("letter_step_size", random(1,5), 1, 10, 0.1, true);
  parameterize("letter_amplitude", random(15,20), 1, base_y/4, 0.1, true);
  parameterize("tightness", random(4,5), -5, 5, 0.1, false);

  if(random()>0.75){
    parameterize("margin_x", -base_x/4, -base_x/4, base_x/4, 1, true);
    parameterize("margin_y", -base_y/4, -base_y/4, base_y/4, 1, true);
  }
  else{
    parameterize("margin_x", base_x/random(5,15), -base_x/4, base_x/4, 1, true);
    parameterize("margin_y", 0, -base_y/4, base_y/4, 1, true);
  }
}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();

  //apply background
  let bg_c;
  if(global_palette_id == 6) bg_c = working_palette[7];
  else if(global_palette_id == 12) bg_c = working_palette[0];
  else if(global_palette_id == 14) bg_c = working_palette[5];
  else bg_c = random(working_palette);
  reduce_array(working_palette, bg_c);
  if(type == "png") background(bg_c);

  //actual drawing stuff
  push();
  noFill();
  const num_lines = floor((canvas_y - margin_y*2)/letter_amplitude/2)-2;
  const tile_x = letter_step_size;
  strokeWeight(1.25*global_scale);
  const stroke_c = random(working_palette);
  if(type == "png") stroke(stroke_c);

  //space between words
  const space_size = letter_amplitude/4;

  let current_y = letter_amplitude*2 + margin_y/2;
  let word_count = 0;
  for(let j=0; j<num_lines; j++){
    push();
    //reset x position
    let current_x = margin_x;
    while(current_x<canvas_x-margin_x*2){
      push();
      translate(current_x, current_y);
      const word_len = random(5, 20);

      //top line gets more space from body
      if(j ==0) translate(0, -letter_amplitude/2);
      //signature line gets random palcement;
      if(j == num_lines-1) translate(random(canvas_x-margin_x*2), letter_amplitude);

      //average sentence is 15-20 words
      //maybe use 1-2 commas between punctuation
      //1 em dash every once in a great while
      //multi line signature?

      beginShape();
      splineProperty("tightness", tightness);
      splineVertex(random(-10,5)*global_scale,0);
      splineVertex(random(-10,5)*global_scale,0);
      let x_movement;
      for(let i = 0;  i<word_len; i++){
        const l_r = random([-1,1,1])*tile_x*3;
        const u_d = random([-1,1])*random([letter_amplitude*3/4, letter_amplitude*3/4, letter_amplitude]);
        x_movement = i*tile_x+noise(i+j)*l_r;
        splineVertex(x_movement, noise(i+j)*u_d);
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
        translate(current_x - space_size, current_y + letter_amplitude/2);
        beginShape();
        splineVertex(0, 0);
        splineVertex(0, 0);
        for(let i=0; i<2; i++){
          splineVertex(random(-1,1)*global_scale, random(-0.25, 0.25)*global_scale);
        }
        endShape();
        pop();
        if(random()>0.75){
          //exlcamation
          push();
          translate(current_x - space_size, current_y + letter_amplitude/2-4*global_scale);
          beginShape();
          splineVertex(0,0);
          splineVertex(0,0);
          splineVertex(random(0,4*global_scale), random(0.5, 1)*(-letter_amplitude));
          splineVertex(4*global_scale, -letter_amplitude);
          endShape();
          pop();
        }
        else if(random()>0.75){
          //question mark
          push();
          translate(current_x - space_size, current_y + letter_amplitude/2-4*global_scale);
          splineProperty("tightness", random(-1, 0.5));
          rotate(random(-5,5));
          beginShape();
          splineVertex(0,0);
          splineVertex(0,0);
          splineVertex(0, random(0.9,1.1)*(-letter_amplitude/3));
          splineVertex(random(0.9,1.1)*6*global_scale, -letter_amplitude*3/4);
          splineVertex(0, random(0.9,1.1)*(-letter_amplitude));
          splineVertex(0, random(0.9,1.1)*(-letter_amplitude/2));
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
        splineProperty("tightness", 0);
        translate(current_x - x_movement + space_size, current_y + letter_amplitude*3/4);
        beginShape();
        const y_start = random(-1,1)*letter_amplitude/4;
        splineVertex(0,y_start);
        splineVertex(0,y_start);
        for(let i=0; i<5; i++){
          splineVertex(x_movement*i/5, random(-1,1)*letter_amplitude/16 + y_start)
        }
        endShape();
        pop();
      }
    }
    current_y += letter_amplitude*2;
    pop();
  }
  //grain
  pop();
  if(type == "png"){
    push();
    noFill();
    stroke("#f3f0de");
    // stroke(random(working_palette));
    strokeWeight(global_scale*0.006);
    for(let i=0; i<60000; i++){
      circle(random(-canvas_x/2, canvas_x*1.5), random(-canvas_y/2, canvas_y*1.5), canvas_x/2);
    }
    pop();  
  }

  global_draw_end();
}
//***************************************************
//custom funcs
