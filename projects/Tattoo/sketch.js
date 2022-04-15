function reset_values(){
  //reset project values here for redrawing 
  line_length = 60*global_scale;
  tile_width = canvas_x / line_length;
  tile_height = canvas_y / line_length;
}

//***************************************************
function setup() {
  common_setup();
}
//***************************************************
function draw() {
  //bleed
  bleed_border = apply_bleed();

  //apply background
  background("WHITE")

  //actual drawing stuff
  push();
  sym_angs = 3;
  for(let i=0; i<sym_angs; i++){
    sine_line(canvas_x/2, canvas_y/2, canvas_x*.8, canvas_y/2);
    center_rotate(floor(360/sym_angs));
  }

  pop();
  //cutlines
  apply_cutlines();
}
//***************************************************
//custom funcs


function sine_line(start_x, start_y, end_x, end_y){
  push();
    translate(start_x, start_y);
    end_x = end_x-start_x;
    end_y = end_y-start_y;

    line_len = sqrt(pow(end_x, 2) + pow(end_y,2));
    slope = end_y/end_x;
    offset = end_y - slope*end_x;

    amp = 1;
    freq = 1;
    amp_max = 150;
    freq_max = 40;
    amp_step = 3*global_scale;
    freq_step = 0.25*global_scale;

    step = 2*global_scale
    strokeWeight(1*global_scale)
    fill("BLACK");
    circle(line_len/2, slope*line_len/2+offset, line_len*.6);
    
    line(0,0, line_len*.2, slope*line_len*.2+offset);

    
    stroke("WHITE");
    strokeWeight(2*global_scale);
    beginShape();
    curveVertex(0,0);
    for(let i=line_len*.2; i<=line_len*.9; i+=step){

      if(i/line_len<.4 && i/line_len>.2){
        amp += amp_step;
        if(amp>amp_max){
          amp = amp_max;
        }
        freq += freq_step;
        if(freq>freq_max){
          freq = freq_max;
        }
      }

      if(i/line_len<.8 && i/line_len>.6){
        amp -= amp_step;
        if(amp<1){
          amp = 1;
        }
        freq -= freq_step;
        if(freq<1){
          freq = 1;
        }
      }


      curveVertex(i, slope*i+offset + sin(i*freq)*amp);
    }
    endShape();

    stroke("BLACK")
    strokeWeight(1*global_scale);
    line(line_len*.8, slope*line_len*.8+offset, end_x, end_y);

  pop();
}

