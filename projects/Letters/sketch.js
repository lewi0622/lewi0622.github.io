let font;
function preload() {
  font = loadFont('..\\..\\fonts\\Roboto-Black.ttf');
}

gif = false;
fr = 1;
capture = false;
capture_time = 10;
function setup() {
  common_setup(gif, P2D, 400, 400);
  bg_1 = random(palette);
  bg_2 = random(palette);
  while(arrayEquals(bg_1, bg_2)){
    bg_2 = random(palette);
  }
  col1 = random(palette);
  col2 = random(palette);
  col3 = random(palette);
  col4 = random(palette);

  while(arrayEquals(col1, bg_1)){
    col1 = random(palette);
  }
  while(arrayEquals(col2, bg_2)){
    col2 = random(palette);
  }
  while(arrayEquals(col3, bg_2)){
    col3 = random(palette);
  }
  while(arrayEquals(col4, bg_1)){
    col4 = random(palette);
  }
  // cols = [[col1, col2], [col3, col4]];
  cols = [[bg_2, bg_1], [bg_1, bg_2]];
}
//***************************************************
function draw() {
  clear();
  capture_start(capture);
  //bleed
  bleed_border = apply_bleed();

  //apply background
  noStroke();
  fill(bg_1);
  square(0,0, canvas_x/2)
  square(canvas_x/2, canvas_y/2, canvas_x/2);
  fill(bg_2);
  square(canvas_x/2, 0, canvas_x/2);
  square(0, canvas_y/2, canvas_x/2);

  //actual drawing stuff

  letters = Array.from("LOVE");

  strokeWeight(0.03*global_scale);

  noFill();
  loop_counter = 0;
  for(let i=0; i<2; i++){
    for (let j=0; j<2; j++){
      letter = letters[loop_counter]
      points = font.textToPoints(letter, 0,0, 80*global_scale, {
        sampleFactor: 1
      });
    
      min_x = points[0].x;
      min_y = points[0].y;
      max_x = points[0].x;
      max_y = points[0].y;
      points.forEach(p => {
        if(p.x>max_x){max_x = p.x}
        else if(p.x<min_x){min_x = p.x}
        if(p.y>max_y){max_y = p.y}
        else if(p.y<min_y){min_y = p.y}
      })
      push();

      stroke(cols[i][j]);

      translate(canvas_x/4+j*canvas_x/2, canvas_y/4 + i*canvas_y/2);

      translate((min_x-max_x)/2 - min_x, (max_y-min_y)/2 - max_y);

      circle_size = 100*global_scale;
      square_size = circle_size/20;
      points.forEach(p => {
        push();
        translate(p.x, p.y)
        circle(0,0, circle_size);
        square(-square_size/2, -square_size/2, square_size);
        pop();
      });
      pop();
      loop_counter++;
    }
  }

  //cleanup
  apply_cutlines();

  capture_frame(capture, num_frames);
}
//***************************************************
//custom funcs


