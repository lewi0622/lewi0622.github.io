//template globals
let input, button, randomize;

let up_scale = 1;
let canvas_x = 400*up_scale;
let canvas_y = 400*up_scale;
let hidden_controls = false;

//global func, can be blank
function reset_values(){
  //reset project values here for redrawing 
  palette = JSON.parse(JSON.stringify(global_palette));
}

//***************************************************
function setup() {
  common_setup();
}

function draw() {
  //set background, and remove that color from the palette
  bg = random(palette)
  background(bg);
  reduce_array(palette, bg);
  
  let last_color = palette[0];
  let c = last_color;

  let thickness = 25*up_scale;
  let length = 100*up_scale;
  let lines = 3;
  let bars = 3;

  for (let i = 0; i<bars; i++){
    push();
    //get non_duplicate color
    while (c == last_color){
      c = random(palette)
    }
    //set opacity
    c[3] = floor(random(200, 240));
    //set color
    stroke(c);
    //set location
    translate(random(150*up_scale,250*up_scale), random(150*up_scale, 250*up_scale));

    //correct placement if rotated
    rotate(random([0, 90]));
    equals(lines, length, thickness);
    
    last_color = c;
    pop();     
  }
}

//custom funcs
function equals(lines, length, thickness){

  strokeWeight(thickness);

  for (let i = 0; i < lines; i++){
    line(-length/2,0, length/2, 0);
    translate(0,thickness*1.5);
  }
}
