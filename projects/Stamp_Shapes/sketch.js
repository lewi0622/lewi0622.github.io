//template globals
let input, button, randomize;

let up_scale = 1;
let canvas_x = 400*up_scale;
let canvas_y = 400*up_scale;
let hidden_controls = false;

//global func, can be blank
function reset_values(){
  //reset project values here for redrawing 
  palette = JSON.parse(JSON.stringify(palettes[2]));
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
  
  for (let i = 0; i<3; i++){
    push();
    //get non_duplicate color
    while (c == last_color){
      c = random(palette)
    }
    //set opacity
    c[3] = floor(random(200, 240));
    //set color
    fill(c);
    //set location
    translate(random(100*up_scale,200*up_scale), random(50*up_scale, 300*up_scale));
    //correct placement if rotated
    if (random([0, 90]) == 90){
      translate(75*up_scale, -25*up_scale);
      rotate(90);
    }
    equals();
    
    last_color = c;
    pop();     
  }
}

function equals(){
  var thickness = 25*up_scale;
  var length = 100*up_scale;
  var lines = 3;
  push();
  for (let i = 0; i < lines; i++){
    beginShape();
    noStroke();
    beginShape();
    vertex(0, 0); // first point
    vertex(length, 0)
    bezierVertex(length*(1+0.2), 0, length*(1+0.2), thickness, length, thickness);
    vertex(0,thickness);
    bezierVertex(length*(-0.2), thickness, length*(-0.2), 0, 0, 0);
    endShape();
    translate(0,thickness*1.5);
  }
  pop();
}