'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;
const sixteen_by_nine = false;
suggested_palettes = [SIXTIES]

function gui_values(){
}

function setup() {
  common_setup(gif, SVG, 8.5*96, 11*96);
}
//***************************************************
function draw() {
  capture_start(capture);

  //bleed
  const bleed_border = apply_bleed();

  refresh_working_palette();

  //apply postcard lines
  noFill();
  rect(0,0,canvas_x, canvas_y);
  line(canvas_x/2, 0, canvas_x/2, canvas_y);
  line(0,canvas_y/2, canvas_x, canvas_y/2);

  //actual drawing stuff
  image(write_letter(canvas_x/2, canvas_y/2));
  image(write_letter(canvas_x/2, canvas_y/2), canvas_x/2,0);
  image(write_letter(canvas_x/2, canvas_y/2), 0, canvas_y/2);
  image(write_letter(canvas_x/2, canvas_y/2), canvas_x/2, canvas_y/2);
  
  //cutlines
  apply_cutlines(bleed_border);

  capture_frame(capture);
}
//***************************************************
//custom funcs

function write_letter(pg_width, pg_height){
  const tile_div = random(70, 300);
  const amp_start = random(15,20)*global_scale;
  const tightness = random(4,5);

  const pg = createGraphics(pg_width, pg_height, SVG);
  pg.angleMode(DEGREES)
  pg.push();
  pg.noFill();
  const num_lines = floor(pg_height/amp_start/2)-2;
  const tile_x = pg_width/tile_div;
  pg.strokeWeight(1.25*global_scale);
  const margin_y = random(30, 60)*global_scale;
  pg.stroke(random(working_palette));

  //space between words
  const space_size = amp_start/4;

  //reset y position
  let current_y = margin_y;
  let word_count = 0;
  for(let j=0; j<num_lines; j++){
    pg.push();
    const margin_x = 60*global_scale;

    //reset x position
    let current_x = margin_x;
    while(current_x<pg_width-margin_x*2){
      pg.push();
      pg.translate(current_x, current_y);
      const word_len = random(5, 20);
      if(j ==0) pg.translate(0, -amp_start/2);
      if(j == num_lines-1) pg.translate(random(pg_width-margin_x*2), amp_start);

      //average sentence is 15-20 words
      //maybe use 1-2 commas between punctuation
      //1 em dash every once in a great while
      //multi line signature?

      pg.beginShape();
      pg.curveTightness(tightness);
      pg.curveVertex(random(-10,5)*global_scale,0);
      pg.curveVertex(random(-10,5)*global_scale,0);
      let x_movement;
      for(let i = 0;  i<word_len; i++){
        const l_r = random([-1,1,1])*tile_x*3;
        const u_d = random([-1,1])*random([amp_start*3/4, amp_start*3/4, amp_start]);
        x_movement = i*tile_x+noise(i+j)*l_r;
        pg.curveVertex(x_movement, noise(i+j)*u_d);
      }
      pg.endShape();

      word_count++

      //move by word lenght plus some space
      current_x += x_movement + space_size;
      pg.pop();

      //chance for punctuation
      if((j == num_lines -2 && current_x>pg_width-margin_x*2)  || word_count>8 && random()>map(word_count, 0,20, 1, 0.8)){
        pg.push();
        //period
        pg.translate(current_x - space_size, current_y + amp_start/2);
        pg.beginShape();
        pg.curveVertex(0, 0);
        pg.curveVertex(0, 0);
        for(let i=0; i<2; i++){
          pg.curveVertex(random(-1,1)*global_scale, random(-0.25, 0.25)*global_scale);
        }
        pg.endShape();
        pg.pop();
        if(random()>0.75){
          //exlcamation
          pg.push();
          pg.translate(current_x - space_size, current_y + amp_start/2-4*global_scale);
          pg.beginShape();
          pg.curveVertex(0,0);
          pg.curveVertex(0,0);
          pg.curveVertex(random(0,4*global_scale), random(0.5, 1)*(-amp_start));
          pg.curveVertex(4*global_scale, -amp_start);
          pg.endShape();
          pg.pop();
        }
        else if(random()>0.75){
          //question mark
          pg.push();
          pg.translate(current_x - space_size, current_y + amp_start/2-4*global_scale);
          pg.curveTightness(random(-1, 0.5));
          pg.rotate(random(-5,5));
          pg.beginShape();
          pg.curveVertex(0,0);
          pg.curveVertex(0,0);
          pg.curveVertex(0, random(0.9,1.1)*(-amp_start/3));
          pg.curveVertex(random(0.9,1.1)*6*global_scale, -amp_start*3/4);
          pg.curveVertex(0, random(0.9,1.1)*(-amp_start));
          pg.curveVertex(0, random(0.9,1.1)*(-amp_start/2));
          pg.endShape();
          pg.pop();
        }
        pg.translate(global_scale*10, 0);
        word_count = 0;
      }
      if(j == 0 && (word_count > 1 && random()>0.2)|| j == num_lines-1) break;
      if(random()>0.98){
        //underline
        pg.push();
        pg.curveTightness(0);
        pg.translate(current_x - x_movement + space_size, current_y + amp_start*3/4);
        pg.beginShape();
        const y_start = random(-1,1)*amp_start/4;
        pg.curveVertex(0,y_start);
        pg.curveVertex(0,y_start);
        for(let i=0; i<5; i++){
          pg.curveVertex(x_movement*i/5, random(-1,1)*amp_start/16 + y_start)
        }
        pg.endShape();
        pg.pop();
      }
    }
    current_y += amp_start*2;
    pg.pop();
  }
  pg.pop();
  return pg;
}