gif = true;
fr = 30;
initialized = false;

xoff = 0;
inc = 0.01*60/fr;

rows = [];
cols = [];

capture = false;
capture_time = 8;
function setup() {
  common_setup(gif);

  palette = JSON.parse(JSON.stringify(shuffle(palette, true))).slice(0,5);
  bg_c = bg(true);
  palette_reset = JSON.parse(JSON.stringify(shuffle(palette, true)));
}
//***************************************************
function draw() {
  capture_start(capture);
  if(gif){
    clear();
    background(bg_c);
    palette = palette_reset;
    color_id = 0;
    padding = 10*global_scale;
    spacing = 2*padding;
  }

  if(!initialized){
    //create arrays of static lines
    for(let i=0; i<=(canvas_y-padding*2)/spacing; i++){
      cols = [];
      start = padding;
      end = 0;
      while(end != canvas_x-padding){
        end = start + floor(random(3, 70)*global_scale);
        if(end>canvas_x-padding || end + spacing>canvas_x-padding){
          end=canvas_x-padding;
        }
        cols.push([start, end])
        start = end + spacing;
      }
      rows.push(cols)
    }
    initialized = true;
  }

  //bleed
  const bleed_border = apply_bleed();

  //actual drawing stuff
  push();

  strokeWeight(padding);
  strokeCap(ROUND);

  translate(0, padding)

  for(let i=0; i<rows.length; i++){
    for(let j=0; j<rows[i].length; j++){
      elem = rows[i][j]
      start = elem[0];
      end = elem[1];
      stroke(palette[color_id%palette.length]);
      line(start, 0, end, 0);

      //subline
      push();
        stroke(palette[(color_id+1)%palette.length]);
        sub_line = floor(map(noise(i+j+xoff), 0, 1, start,end));
        line(sub_line,0, sub_line+1*global_scale, 0);
      pop();

      color_id ++;
    }
    translate(0, spacing);
  }
  xoff += inc;
  pop();
  //cutlines
  apply_cutlines(bleed_border);
  
  capture_frame(capture);
}
//***************************************************
//custom funcs




