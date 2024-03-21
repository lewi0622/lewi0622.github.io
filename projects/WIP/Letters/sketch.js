let font;
function preload() {
  font = loadFont('..\\..\\..\\fonts\\Roboto-Black.ttf');
}
animation = false;
gif = false;
fr = 2;
capture = false;
capture_time = 10;
const suggested_palettes = [COTTONCANDY, BIRDSOFPARADISE, SUPPERWARE];

function gui_values(){

}

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();

  //apply background
  refresh_working_palette();

  c=random(working_palette);
  reduce_array(working_palette,c)

  bg_1 = random(working_palette);
  bg_2 = random(working_palette);
  while(arrayEquals(bg_1, bg_2)){
    bg_2 = random(working_palette);
  }

  cols = [[bg_2, bg_1], [bg_1, bg_2]];

  noStroke();
  fill(bg_1);
  square(0,0, canvas_x/2)
  square(canvas_x/2, canvas_y/2, canvas_x/2);
  fill(bg_2);
  square(canvas_x/2, 0, canvas_x/2);
  square(0, canvas_y/2, canvas_x/2);


  //texture
  stroke(c);
  noFill();
  strokeWeight(global_scale*0.005);
  for(let i=0; i<60000; i++){
    circle(random(-canvas_x/2, canvas_x*1.5), random(-canvas_y/2, canvas_y*1.5), canvas_x/2);
  }
  //actual drawing stuff

  //ideas for words: LOVE, SOUL, JAZZ, CASH, DRAW, BABE, LIFE, NERD, YEAH, HEY!
  words = ["LOVE", "SOUL", "JAZZ", "CASH", "LIFE", "YEAH", "HEY!"]

  letters = Array.from(random(words));

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

  global_draw_end();
}
//***************************************************
//custom funcs


