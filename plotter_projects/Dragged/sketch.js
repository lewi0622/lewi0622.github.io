'use strict';
//setup variables
const gif = false;
const animation = false;
const fr = 1;
const capture = false;
const capture_time = 10;

const suggested_palettes = [];

/*
Inspired by:
https://scontent-msp1-1.cdninstagram.com/v/t51.29350-15/403800088_1815717065536500_1600613248915314986_n.jpg?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0uaW1hZ2VfdXJsZ2VuLjE0NDB4MTQ0MC5zZHIuZjI5MzUwLmRlZmF1bHRfaW1hZ2UuYzIifQ&_nc_ht=scontent-msp1-1.cdninstagram.com&_nc_cat=100&_nc_oc=Q6cZ2QEo66uXC7RqZSeyYE4x70PFVos41G1VvmACCTavLiCm4tns0_rkA7Ox83Te4ZAHduE&_nc_ohc=keSUMtyOe_MQ7kNvwGKgubg&_nc_gid=6m4rjJqv1A_kHM2H2kOvow&edm=AP4sbd4BAAAA&ccb=7-5&ig_cache_key=MzIzODA3MTg5OTcyMjU3MDE2MQ%3D%3D.3-ccb7-5&oh=00_AfoclvLHRphZprlSgJ2lJN4b6jc3pOdP-1WsS3oQ2_Lkcw&oe=69632EBE&_nc_sid=7a9f4b

Idea:
Red Pen
Small dip in orange ink 
(micron kind of clogs every once in a while when dipping in the Trans.Mix Media ink, 
it helps to push down on it might be good to use the spring attachment on the brushless servo)

Go over it separately with a separate implement,
Small dip in thicker purple paint (acrylic or gouache)

Draw line
for PNG draw thicker purple line for certain distance and then thinner line lerping from orange to red
for SVG just draw a line

Don't sort lines
Ideally we'd dip every time in both the ink and the paint
Need to verify distance required to run through the dipped material
test with fixed distance lines
*/

function gui_values(){
  parameterize("margin_x", base_x * 0.2, 0, base_x, 1, true);
  parameterize("margin_y", base_y * 0.5, 0, base_y, 1, true);
  parameterize("max_height", base_y * 0.5, 0, base_y*2, 1, true);
  parameterize("rows", round(base_y/40), 1, base_y/2, 1, false);
  parameterize("cols", round(base_x/4), 1, base_y/2, 1, false);
} 

function setup() {
  common_setup();
  gui_values();
}
//***************************************************
function draw() {
  global_draw_start();

  //actual drawing stuff
  push();
  png_bg();
  strokeWeight(MICRON05*global_scale);

  const purple = color("PURPLE");
  const orange = color("ORANGE");
  orange.setAlpha(150);
  const red = color("RED");
  red.setAlpha(100);
  
  const col_step = (canvas_x - margin_x)/cols;
  const row_step = 0.4 * max_height / rows;
  
  translate(margin_x/2, margin_y/4);
  
  for(let i=rows; i>=0; i--){ 
    //drawing rows in reverse order to draw through the purple already placed in the lower rows
    for(let j=0; j<cols; j++){
      push();
      translate(j * col_step, i * row_step);
      translate(random(-1,1) * col_step, 10 * noise(j) * row_step);
      const length = map(noise(i/10, j/100), 0,1, 0, max_height);
      
      if(type == "png"){
        stroke(purple);
        strokeWeight(3);
        line(0,0, 0, length * 0.1);

        stroke(orange);
        strokeWeight(1);
        line(0,length*0.1, 0, length * 0.5);

        stroke(red);
        line(0, length * 0.5, 0, length);
      } else{
        line(0,0, 0,length);
      }

      pop();
    }
  }

  pop();
  global_draw_end();
}
//***************************************************
//custom funcs