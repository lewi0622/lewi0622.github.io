gif = true;
fr = 30;

capture = false;
capture_time = 10;
function setup() {
  // suggested_palette = random([SAGEANDCITRUS, COTTONCANDY, SUPPERWARE]);
  common_setup(gif);

  //define grid
  slots = 40;
  grid_size = canvas_x/slots;
  bar_grey = color(160, 165, 177);
  //create array of bars
  num_bars = slots/2;
  bar_speed = 5*global_scale;
  bars = []
  for(let i=0; i<num_bars; i++){
    current_slot = floor(random(slots))*grid_size;
    const base_color = random(palette);
    bars.push({
      base_color: base_color,
      current_color: base_color,
      x: current_slot,
      new_x: current_slot,  //stationary till timer runs out
      timer: floor(random(0,10)*fr),    //framecount before new slot calc
      moving: false
    })
  }

  bg_c = random(palette);
}
//***************************************************
function draw() {
  capture_start(capture);

  clear();
  //bleed
  const bleed_border = apply_bleed();

  working_palette = JSON.parse(JSON.stringify(palette));
  // reduce_array(working_palette, bg_c)

  //apply background
  background(57, 59, 63);
  strokeCap(random([PROJECT,ROUND]))

  //actual drawing stuff
  push();
  noStroke();
  for(let i=0; i<bars.length; i++){
    push();
    bar = bars[i];
    if(bar.timer <= 0){
      bar.timer = floor(random(5,10)*fr);
      bar.new_x = floor(random(slots))*grid_size;
      bar.moving = true;
    }
    //find distance to nearest bar
    nearest_dist = canvas_x;
    nearest_bar = -1;
    bars.forEach((e, idx) => {
      if(idx != i){
        if(abs(e.x-bar.x)<nearest_dist){
          nearest_dist = abs(e.x-bar.x);
          nearest_bar = idx;
        }
      }
    });
    c = bar.base_color;
    if(nearest_dist/grid_size<3){
      drawingContext.shadowColor = color(bar.base_color);
      drawingContext.shadowBlur = map(nearest_dist/grid_size, 0,3, 15,0)*global_scale
    }
    if(nearest_dist == 0 && !bar.moving && !bars[nearest_bar].moving){
      // bar.color = [255,255,255]
      // bars[nearest_bar].color = [255,255,255]
      c = color("WHITE");
      drawingContext.shadowColor = color("WHITE");
      drawingContext.shadowBlur = 15*global_scale;
    }

    fill(c);

    //move towards new location
    if(bar.moving){
      if(abs(bar.new_x - bar.x)<bar_speed){
        bar.x = bar.new_x;
        bar.moving = false;
      }
      else{
        bar.x = bar.x + (Math.sign(bar.new_x-bar.x)*bar_speed);
      }
    }

    translate(bar.x, 0);
    rect(0,0, grid_size, canvas_y);

    bar.timer--;
    pop();
  }

  //check for neighbors
  
  pop();
  //cutlines
  apply_cutlines(bleed_border);
  capture_frame(capture);
}
//***************************************************
//custom funcs




